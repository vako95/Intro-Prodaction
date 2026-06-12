from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.utils import timezone
from decimal import Decimal
import uuid

from ...models import Cart, Order, OrderItem, Payment, Coupon
from ...services import StripeService
from ..serializers import (
    CreateOrderSerializer,
    OrderSerializer,
    PaymentIntentSerializer,
    ConfirmPaymentSerializer,
    PaymentSerializer,
)


class CreateOrderView(CreateAPIView):
    """
    POST /api/v2/shop/checkout/create-order/
    Создать заказ из корзины
    Body: {
        "coupon_code": "SAVE10",  // optional
        "notes": "Special requests"  // optional
    }
    """
    serializer_class = CreateOrderSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        # Добавляем детальное логирование
        print(f"Create order request data: {request.data}")
        print(f"User: {request.user}")
        print(f"Is authenticated: {request.user.is_authenticated}")
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            print(f"Validation error: {str(e)}")
            print(f"Serializer errors: {serializer.errors}")
            return Response(
                {
                    "detail": "Validation failed",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                # Получаем корзину
                cart = Cart.objects.select_related('user').prefetch_related(
                    'items__room'
                ).get(user=request.user)

                print(f"Cart found: {cart.id}, items count: {cart.items.count()}")

                if cart.items.count() == 0:
                    return Response(
                        {"detail": "Cart is empty"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Создаем заказ
                order = Order.objects.create(
                    user=request.user,
                    order_number=self._generate_order_number(),
                    status='pending',
                    payment_status='pending',
                    total_amount=Decimal('0.00'),
                    discount_amount=Decimal('0.00'),
                    final_amount=Decimal('0.00'),
                    notes=serializer.validated_data.get('notes', '')
                )

                print(f"Order created: {order.order_number}")

                # Применяем купон если есть
                coupon_code = serializer.validated_data.get('coupon_code')
                if coupon_code and coupon_code.strip():  # Проверяем что код не пустой
                    try:
                        coupon = Coupon.objects.get(
                            code=coupon_code.upper().strip(),
                            is_active=True,
                            valid_from__lte=timezone.now(),
                            valid_to__gte=timezone.now()
                        )
                        order.coupon = coupon
                        print(f"Applied coupon: {coupon.code}")
                    except Coupon.DoesNotExist:
                        print(f"Coupon not found: {coupon_code}")
                        pass

                # Создаем order items из cart items
                total_amount = Decimal('0.00')
                for cart_item in cart.items.all():
                    nights = (cart_item.check_out - cart_item.check_in).days
                    subtotal = cart_item.room.final_price * nights * cart_item.rooms_count

                    OrderItem.objects.create(
                        order=order,
                        room=cart_item.room,
                        check_in=cart_item.check_in,
                        check_out=cart_item.check_out,
                        adults=cart_item.adults,
                        children=cart_item.children,
                        rooms_count=cart_item.rooms_count,
                        price_per_night=cart_item.room.final_price,
                        nights=nights,
                        subtotal=subtotal
                    )

                    total_amount += subtotal

                # Обновляем суммы заказа
                order.total_amount = total_amount

                # Применяем скидку купона
                if order.coupon:
                    if order.coupon.discount_type == 'percentage':
                        order.discount_amount = (total_amount * order.coupon.discount_value) / 100
                    else:  # fixed
                        order.discount_amount = order.coupon.discount_value

                order.final_amount = order.total_amount - order.discount_amount
                order.save()

                print(f"Order totals - Total: {order.total_amount}, Discount: {order.discount_amount}, Final: {order.final_amount}")

                # Очищаем корзину
                cart.items.all().delete()

                print(f"Cart cleared, returning order data")

                return Response(
                    OrderSerializer(order, context={'request': request}).data,
                    status=status.HTTP_201_CREATED
                )

        except Cart.DoesNotExist:
            print(f"Cart not found for user: {request.user}")
            return Response(
                {"detail": "Cart not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error creating order: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def _generate_order_number(self):
        """Генерация уникального номера заказа"""
        return f"ORD-{uuid.uuid4().hex[:8].upper()}-{timezone.now().strftime('%Y%m%d')}"


class OrderDetailView(RetrieveAPIView):
    """
    GET /api/v2/shop/checkout/orders/{order_number}/
    Получить детали заказа по order_number
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'order_number'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__room')


class CreatePaymentIntentView(APIView):
    """
    POST /api/v2/shop/checkout/create-payment-intent/
    Создать Stripe Payment Intent
    Body: {
        "order_id": 1
    }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PaymentIntentSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        order_id = serializer.validated_data['order_id']

        try:
            order = Order.objects.get(id=order_id, user=request.user)

            if order.payment_status != 'pending':
                return Response(
                    {"detail": "Order is already paid or cancelled"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Создаем Payment Intent через Stripe
            print(f"Creating payment intent for order {order.id}, amount: {order.final_amount}")
            
            result = StripeService.create_payment_intent(
                amount=float(order.final_amount),
                currency='usd',
                metadata={
                    'order_id': order.id,
                    'order_number': order.order_number,
                    'user_id': request.user.id,
                }
            )

            print(f"Payment intent result: {result}")

            if not result['success']:
                error_msg = result.get('error', 'Failed to create payment intent')
                print(f"Payment intent creation failed: {error_msg}")
                return Response(
                    {"detail": error_msg},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Создаем запись о платеже
            payment = Payment.objects.create(
                order=order,
                user=request.user,
                amount=order.final_amount,
                payment_method='stripe',
                status='pending',
                transaction_id=result['payment_intent_id'],
                payment_gateway='stripe',
                metadata={
                    'payment_intent_id': result['payment_intent_id'],
                    'client_secret': result['client_secret'],
                }
            )

            return Response({
                'client_secret': result['client_secret'],
                'payment_intent_id': result['payment_intent_id'],
                'amount': float(order.final_amount),
                'currency': 'usd',
                'order_id': order.id,
                'order_number': order.order_number,
                'payment_id': payment.id,
            }, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ConfirmPaymentView(APIView):
    """
    POST /api/v2/shop/checkout/confirm-payment/
    Подтвердить платеж после успешной оплаты
    Body: {
        "order_id": 1,
        "payment_intent_id": "pi_xxx"
    }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ConfirmPaymentSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        order_id = serializer.validated_data['order_id']
        payment_intent_id = serializer.validated_data['payment_intent_id']

        try:
            with transaction.atomic():
                order = Order.objects.select_for_update().get(
                    id=order_id,
                    user=request.user
                )

                # Проверяем статус платежа в Stripe
                result = StripeService.get_payment_status(payment_intent_id)

                if not result['success']:
                    return Response(
                        {"detail": "Failed to verify payment"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                payment_status = result['status']

                # Обновляем платеж
                payment = Payment.objects.get(
                    order=order,
                    transaction_id=payment_intent_id
                )

                if payment_status == 'succeeded':
                    payment.status = 'completed'
                    payment.payment_date = timezone.now()
                    payment.save()

                    # Обновляем заказ
                    order.payment_status = 'paid'
                    order.status = 'confirmed'
                    order.save()

                    return Response({
                        'success': True,
                        'order': OrderSerializer(order, context={'request': request}).data,
                        'payment': PaymentSerializer(payment).data,
                    }, status=status.HTTP_200_OK)

                elif payment_status == 'processing':
                    payment.status = 'processing'
                    payment.save()

                    return Response({
                        'success': False,
                        'status': 'processing',
                        'detail': 'Payment is being processed',
                    }, status=status.HTTP_200_OK)

                else:
                    payment.status = 'failed'
                    payment.save()

                    order.payment_status = 'failed'
                    order.save()

                    return Response({
                        'success': False,
                        'status': 'failed',
                        'detail': 'Payment failed',
                    }, status=status.HTTP_400_BAD_REQUEST)

        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Payment.DoesNotExist:
            return Response(
                {"detail": "Payment not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class OrderListView(APIView):
    """
    GET /api/v2/shop/checkout/orders/
    Получить список заказов пользователя
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related(
            'items__room'
        ).order_by('-created_at')

        serializer = OrderSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
