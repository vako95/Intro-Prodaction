from rest_framework import serializers
from decimal import Decimal

from ...models import Order, OrderItem, Payment


class CheckoutItemSerializer(serializers.Serializer):
    """Сериализатор для item в checkout"""
    cart_item_id = serializers.IntegerField()
    room_id = serializers.IntegerField()
    room_name = serializers.CharField(read_only=True)
    check_in = serializers.DateField()
    check_out = serializers.DateField()
    adults = serializers.IntegerField(min_value=1)
    children = serializers.IntegerField(min_value=0)
    rooms_count = serializers.IntegerField(min_value=1)
    price_per_night = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    nights = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)


class CreateOrderSerializer(serializers.Serializer):
    """Сериализатор для создания заказа"""
    coupon_code = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    def validate(self, data):
        """Валидация данных заказа"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated")
        
        # Проверяем что корзина не пуста
        from ...models import Cart
        try:
            cart = Cart.objects.get(user=request.user)
            if cart.items.count() == 0:
                raise serializers.ValidationError("Cart is empty")
        except Cart.DoesNotExist:
            raise serializers.ValidationError("Cart not found")
        
        return data


class OrderItemSerializer(serializers.ModelSerializer):
    """Сериализатор для order item"""
    room_title = serializers.CharField(source='room.title_en', read_only=True)
    room_image = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = (
            'id',
            'room',
            'room_title',
            'room_image',
            'check_in',
            'check_out',
            'adults',
            'children',
            'rooms_count',
            'price_per_night',
            'nights',
            'subtotal',
        )
    
    def get_room_image(self, obj):
        if obj.room and obj.room.poster:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.room.poster.url)
        return None


class OrderSerializer(serializers.ModelSerializer):
    """Сериализатор для заказа"""
    items = OrderItemSerializer(many=True, read_only=True)
    coupon_code = serializers.CharField(source='coupon.code', read_only=True, allow_null=True)
    
    class Meta:
        model = Order
        fields = (
            'id',
            'order_number',
            'status',
            'payment_status',
            'total_amount',
            'discount_amount',
            'final_amount',
            'coupon_code',
            'notes',
            'items',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'order_number', 'created_at', 'updated_at')


class PaymentIntentSerializer(serializers.Serializer):
    """Сериализатор для создания Stripe Payment Intent"""
    order_id = serializers.IntegerField()
    
    def validate_order_id(self, value):
        """Проверка существования заказа"""
        request = self.context.get('request')
        try:
            order = Order.objects.get(id=value, user=request.user)
            if order.payment_status != 'pending':
                raise serializers.ValidationError("Order is already paid or cancelled")
            return value
        except Order.DoesNotExist:
            raise serializers.ValidationError("Order not found")


class ConfirmPaymentSerializer(serializers.Serializer):
    """Сериализатор для подтверждения платежа"""
    order_id = serializers.IntegerField()
    payment_intent_id = serializers.CharField()
    
    def validate(self, data):
        """Валидация данных платежа"""
        request = self.context.get('request')
        try:
            order = Order.objects.get(id=data['order_id'], user=request.user)
            if order.payment_status != 'pending':
                raise serializers.ValidationError("Order is already paid or cancelled")
        except Order.DoesNotExist:
            raise serializers.ValidationError("Order not found")
        
        return data


class PaymentSerializer(serializers.ModelSerializer):
    """Сериализатор для платежа"""
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    
    class Meta:
        model = Payment
        fields = (
            'id',
            'order',
            'order_number',
            'amount',
            'payment_method',
            'status',
            'transaction_id',
            'payment_gateway',
            'payment_date',
            'created_at',
        )
        read_only_fields = ('id', 'created_at')
