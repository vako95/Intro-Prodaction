from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from core.responses import ResponseBuilder

from ...selectors import OrderSelector, RoomSelector
from ..serializers.room_order import (
    RoomAvailabilitySerializer,
    RoomOrderCreateSerializer,
    RoomOrderDetailSerializer,
    RoomOrderListSerializer,
)
from ..services import BookingService


class BaseOrderView(APIView):
    """Базовый класс для views с проверкой заказа"""

    permission_classes = [IsAuthenticated]

    def _get_order_or_404(self, pk, user):
        """Получить заказ или вернуть 404"""
        order = OrderSelector.get_order_by_id(pk, user)
        
        if not order:
            return None, ResponseBuilder.error(
                detail="Order not found",
                status_code=status.HTTP_404_NOT_FOUND,
            ).standard()
        
        return order, None


class RoomOrderCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RoomOrderCreateSerializer(
            data=request.data,
            context={"request": request},
        )

        if not serializer.is_valid():
            return ResponseBuilder.error(
                detail="Validation failed",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            ).standard()

        order = serializer.save()

        return ResponseBuilder.success(
            detail="Order created successfully",
            data=RoomOrderDetailSerializer(order, context={"request": request}).data,
            status_code=status.HTTP_201_CREATED,
        ).standard()


class RoomOrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        status_filter = request.query_params.get("status")
        orders = OrderSelector.get_user_orders(request.user, status_filter)

        return ResponseBuilder.success(
            detail="Orders retrieved successfully",
            data=RoomOrderListSerializer(orders, many=True, context={"request": request}).data,
        ).standard()


class RoomOrderDetailView(BaseOrderView):
    def get(self, request, order_slug):
        order, error_response = self._get_order_or_404(order_slug, request.user)
        
        if error_response:
            return error_response

        return ResponseBuilder.success(
            detail="Order retrieved successfully",
            data=RoomOrderDetailSerializer(order, context={"request": request}).data,
        ).standard()


class RoomOrderCancelView(BaseOrderView):
    def post(self, request, order_slug):
        order, error_response = self._get_order_or_404(order_slug, request.user)
        
        if error_response:
            return error_response

        try:
            cancelled_order = BookingService.cancel_booking(order)
        except DjangoValidationError as e:
            return ResponseBuilder.error(
                detail=str(e),
                status_code=status.HTTP_400_BAD_REQUEST,
            ).standard()

        return ResponseBuilder.success(
            detail="Order cancelled successfully",
            data=RoomOrderDetailSerializer(cancelled_order, context={"request": request}).data,
        ).standard()


class RoomOrderDeleteView(BaseOrderView):
    DELETABLE_STATUSES = ["cancelled", "rejected", "abort"]

    def delete(self, request, order_slug):
        order, error_response = self._get_order_or_404(order_slug, request.user)
        
        if error_response:
            return error_response

        if order.status not in self.DELETABLE_STATUSES:
            return ResponseBuilder.error(
                detail="Can only delete cancelled orders",
                status_code=status.HTTP_400_BAD_REQUEST,
            ).standard()

        order.delete()

        return ResponseBuilder.success(
            detail="Order deleted successfully",
            data=None,
            status_code=status.HTTP_204_NO_CONTENT,
        ).standard()


class RoomAvailabilityView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RoomAvailabilitySerializer(data=request.data)

        if not serializer.is_valid():
            return ResponseBuilder.error(
                detail="Validation failed",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            ).standard()

        data = serializer.validated_data
        room = RoomSelector.get_room_by_id(data["room_id"])

        if not room:
            return ResponseBuilder.error(
                detail="Room not found",
                status_code=status.HTTP_404_NOT_FOUND,
            ).standard()

        available_rooms = RoomSelector.get_available_rooms_count(
            room, data["check_in"], data["check_out"]
        )
        price_breakdown = BookingService.calculate_price(
            room, data["check_in"], data["check_out"], data["rooms_count"]
        )

        return ResponseBuilder.success(
            detail="Availability checked successfully",
            data={
                "available": available_rooms >= data["rooms_count"],
                "available_rooms": available_rooms,
                "total_rooms": room.room_count,
                "requested_rooms": data["rooms_count"],
                "check_in": str(data["check_in"]),
                "check_out": str(data["check_out"]),
                **price_breakdown,
            },
        ).standard()


class UserOrderStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return ResponseBuilder.success(
            detail="Stats retrieved successfully",
            data=OrderSelector.get_user_order_stats(request.user),
        ).standard()
