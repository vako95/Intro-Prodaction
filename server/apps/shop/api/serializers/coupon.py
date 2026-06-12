from rest_framework import serializers
from apps.shop.models import Coupon


class CouponValidateSerializer(serializers.Serializer):
    """Serializer для валидации купона"""
    code = serializers.CharField(max_length=50, required=True)
    order_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    room_id = serializers.IntegerField(required=False, allow_null=True)


class CouponResponseSerializer(serializers.ModelSerializer):
    """Serializer для ответа с информацией о купоне"""
    discount_display = serializers.CharField(source='get_discount_display', read_only=True)
    discount_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Coupon
        fields = [
            'id',
            'code',
            'coupon_type',
            'discount_value',
            'discount_display',
            'discount_amount',
            'min_order_amount',
            'max_discount_amount',
            'description',
        ]
