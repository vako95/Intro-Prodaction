from rest_framework import status
from rest_framework.generics import RetrieveAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import Cart, CartItem
from ..serializers import (
    CartSerializer,
    CartItemSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer,
)


class CartView(RetrieveAPIView):
    """
    GET /api/v2/shop/cart/
    Получить корзину текущего пользователя
    """
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart


class AddToCartView(APIView):
    """
    POST /api/v2/shop/cart/add/
    Добавить item в корзину
    Body: {
        "room_id": 1,
        "adults": 2,
        "children": 1,
        "check_in": "2024-12-01",
        "check_out": "2024-12-05",
        "rooms_count": 1
    }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        cart, created = Cart.objects.get_or_create(user=request.user)

        # Проверяем существует ли уже такой item
        existing_item = CartItem.objects.filter(
            cart=cart,
            room_id=data['room_id'],
            check_in=data['check_in'],
            check_out=data['check_out'],
        ).first()

        if existing_item:
            # Обновляем существующий
            existing_item.adults = data['adults']
            existing_item.children = data['children']
            existing_item.rooms_count = data['rooms_count']
            existing_item.save()
            cart_item = existing_item
        else:
            # Создаем новый
            cart_item = CartItem.objects.create(
                cart=cart,
                room_id=data['room_id'],
                adults=data['adults'],
                children=data['children'],
                check_in=data['check_in'],
                check_out=data['check_out'],
                rooms_count=data['rooms_count'],
            )

        return Response(
            CartItemSerializer(cart_item, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class UpdateCartItemView(APIView):
    """
    PATCH /api/v2/shop/cart/items/{item_id}/
    Обновить cart item
    Body: {
        "adults": 3,
        "children": 2,
        "rooms_count": 2
    }
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(
                id=item_id,
                cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response(
                {"detail": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UpdateCartItemSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        if 'adults' in data:
            cart_item.adults = data['adults']
        if 'children' in data:
            cart_item.children = data['children']
        if 'rooms_count' in data:
            cart_item.rooms_count = data['rooms_count']

        # Проверяем capacity
        if (cart_item.adults + cart_item.children) > cart_item.room.capacity_total:
            return Response(
                {"detail": f"Guest count exceeds room capacity ({cart_item.room.capacity_total})"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.save()

        return Response(
            CartItemSerializer(cart_item, context={'request': request}).data,
            status=status.HTTP_200_OK
        )


class RemoveFromCartView(DestroyAPIView):
    """
    DELETE /api/v2/shop/cart/items/{item_id}/
    Удалить item из корзины
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        item_id = kwargs.get('pk')
        
        deleted_count, _ = CartItem.objects.filter(
            id=item_id,
            cart__user=request.user
        ).delete()
        
        if deleted_count > 0:
            return Response(
                {"detail": "Item removed from cart"},
                status=status.HTTP_200_OK
            )
        
        return Response(
            {"detail": "Item not found in cart"},
            status=status.HTTP_404_NOT_FOUND
        )


class ClearCartView(APIView):
    """
    POST /api/v2/shop/cart/clear/
    Очистить всю корзину
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
            deleted_count = cart.items.count()
            cart.items.all().delete()
            
            return Response(
                {"detail": f"Cart cleared. {deleted_count} items removed"},
                status=status.HTTP_200_OK
            )
        except Cart.DoesNotExist:
            return Response(
                {"detail": "Cart is already empty"},
                status=status.HTTP_200_OK
            )
