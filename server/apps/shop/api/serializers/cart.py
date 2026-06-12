from rest_framework import serializers
from django.utils import timezone

from ...models import Cart, CartItem, Room


class CartItemSerializer(serializers.ModelSerializer):
    """Сериализатор для cart item с полной информацией"""
    room_name = serializers.CharField(source='room.title_en', read_only=True)
    room_image = serializers.SerializerMethodField()
    room_price = serializers.FloatField(source='room.final_price', read_only=True)
    nights = serializers.IntegerField(read_only=True)
    subtotal = serializers.FloatField(read_only=True)
    
    class Meta:
        model = CartItem
        fields = (
            'id',
            'room',
            'room_name',
            'room_image',
            'room_price',
            'adults',
            'children',
            'check_in',
            'check_out',
            'rooms_count',
            'nights',
            'subtotal',
            'created_at',
        )
        read_only_fields = ('id', 'created_at')

    def get_room_image(self, obj):
        if obj.room.poster:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.room.poster.url)
        return None

    def validate(self, data):
        """Валидация данных cart item"""
        check_in = data.get('check_in')
        check_out = data.get('check_out')
        room = data.get('room')
        adults = data.get('adults', 1)
        children = data.get('children', 0)

        today = timezone.now().date()

        if check_in < today:
            raise serializers.ValidationError({
                "check_in": "Check-in date cannot be in the past"
            })

        if check_out <= check_in:
            raise serializers.ValidationError({
                "check_out": "Check-out must be after check-in"
            })

        if room and (adults + children) > room.capacity_total:
            raise serializers.ValidationError({
                "adults": f"Guest count exceeds room capacity ({room.capacity_total})"
            })

        return data


class CartSerializer(serializers.ModelSerializer):
    """Сериализатор для корзины с items"""
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    total_price = serializers.FloatField(read_only=True)

    class Meta:
        model = Cart
        fields = ('id', 'items', 'total_items', 'total_price', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class AddToCartSerializer(serializers.Serializer):
    """Сериализатор для добавления в корзину"""
    room_id = serializers.IntegerField()
    adults = serializers.IntegerField(min_value=1, default=1)
    children = serializers.IntegerField(min_value=0, default=0)
    check_in = serializers.DateField()
    check_out = serializers.DateField()
    rooms_count = serializers.IntegerField(min_value=1, default=1)

    def validate_room_id(self, value):
        """Проверка существования комнаты"""
        if not Room.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Room not found or inactive")
        return value

    def validate(self, data):
        """Валидация данных"""
        check_in = data['check_in']
        check_out = data['check_out']
        
        today = timezone.now().date()

        if check_in < today:
            raise serializers.ValidationError({
                "check_in": "Check-in date cannot be in the past"
            })

        if check_out <= check_in:
            raise serializers.ValidationError({
                "check_out": "Check-out must be after check-in"
            })

        room = Room.objects.get(id=data['room_id'])
        if (data['adults'] + data['children']) > room.capacity_total:
            raise serializers.ValidationError({
                "adults": f"Guest count exceeds room capacity ({room.capacity_total})"
            })

        return data


class UpdateCartItemSerializer(serializers.Serializer):
    """Сериализатор для обновления cart item"""
    adults = serializers.IntegerField(min_value=1, required=False)
    children = serializers.IntegerField(min_value=0, required=False)
    rooms_count = serializers.IntegerField(min_value=1, required=False)
