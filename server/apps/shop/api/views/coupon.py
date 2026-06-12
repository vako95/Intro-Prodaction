from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from apps.shop.models import Coupon, Room
from ..serializers.coupon import CouponValidateSerializer, CouponResponseSerializer


class CouponValidateView(APIView):
    """API для валидации купона"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = CouponValidateSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        code = serializer.validated_data['code'].upper()
        order_amount = serializer.validated_data['order_amount']
        room_id = serializer.validated_data.get('room_id')
        
        try:
            coupon = Coupon.objects.get(code=code)
        except Coupon.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Coupon not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Проверка валидности купона
        if not coupon.is_valid():
            return Response({
                'success': False,
                'message': 'Coupon is expired or not active'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Проверка возможности использования купона пользователем
        can_use, message = coupon.can_use(request.user, order_amount)
        if not can_use:
            return Response({
                'success': False,
                'message': message
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Проверка применимости к конкретной комнате
        if room_id:
            if coupon.rooms.exists() and not coupon.rooms.filter(id=room_id).exists():
                return Response({
                    'success': False,
                    'message': 'Coupon is not applicable to this room'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Расчет скидки
        discount_amount = coupon.calculate_discount(order_amount)
        final_amount = order_amount - discount_amount
        
        # Подготовка ответа
        coupon_data = CouponResponseSerializer(coupon).data
        coupon_data['discount_amount'] = float(discount_amount)
        
        return Response({
            'success': True,
            'message': 'Coupon is valid',
            'data': {
                'coupon': coupon_data,
                'original_amount': float(order_amount),
                'discount_amount': float(discount_amount),
                'final_amount': float(final_amount)
            }
        }, status=status.HTTP_200_OK)
