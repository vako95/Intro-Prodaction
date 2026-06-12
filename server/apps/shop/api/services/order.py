import uuid
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from apps.shop.models import Order, OrderItem, OrderStatusHistory, Room

from .booking import BookingService


class OrderService:
    CANCELLABLE_STATUSES = ["cancelled", "completed"]

    @staticmethod
    def generate_order_number() -> str:
        timestamp = timezone.now().strftime("%Y%m%d%H%M%S")
        unique = str(uuid.uuid4())[:8].upper()
        return f"ORD-{timestamp}-{unique}"

    @staticmethod
    @transaction.atomic
    def create_order(user, items_data: list[dict]) -> Order:
        if not items_data:
            raise ValidationError("Order must have at least one item")

        order = Order.objects.create(
            user=user,
            order_number=OrderService.generate_order_number(),
        )

        total = Decimal("0.00")

        for item_data in items_data:
            room_id = item_data["room_id"]
            check_in = item_data["check_in"]
            check_out = item_data["check_out"]
            adults = item_data["adults"]
            children = item_data.get("children", 0)
            rooms_count = item_data.get("rooms_count", 1)

            BookingService.validate_dates(check_in, check_out)

            room = Room.objects.select_for_update().get(pk=room_id, is_active=True)

            BookingService.validate_capacity(room, adults, children)
            BookingService.check_availability(room, check_in, check_out, rooms_count)

            nights = BookingService.calculate_nights(check_in, check_out)
            price_per_night = Decimal(str(room.final_price))
            subtotal = price_per_night * nights * rooms_count

            OrderItem.objects.create(
                order=order,
                room=room,
                check_in=check_in,
                check_out=check_out,
                adults=adults,
                children=children,
                rooms_count=rooms_count,
                price_per_night=price_per_night,
                nights=nights,
                subtotal=subtotal,
            )

            total += subtotal

        order.total_amount = total
        order.save(update_fields=["total_amount", "updated_at"])

        return order

    @staticmethod
    @transaction.atomic
    def update_order_status(
        order: Order,
        new_status: str,
        changed_by=None,
        reason: str = "",
    ) -> Order:
        if order.status == new_status:
            return order

        OrderStatusHistory.objects.create(
            order=order,
            old_status=order.status,
            new_status=new_status,
            changed_by=changed_by,
            reason=reason,
        )

        order.status = new_status
        order.save(update_fields=["status", "updated_at"])

        return order

    @staticmethod
    @transaction.atomic
    def cancel_order(order: Order, user=None, reason: str = "") -> Order:
        if order.status in OrderService.CANCELLABLE_STATUSES:
            raise ValidationError(f"Cannot cancel order with status: {order.status}")

        earliest_check_in = order.items.order_by("check_in").first().check_in
        
        if earliest_check_in <= timezone.now().date():
            raise ValidationError("Cannot cancel order on or after check-in date")

        return OrderService.update_order_status(
            order, "cancelled", changed_by=user, reason=reason
        )

    @staticmethod
    @transaction.atomic
    def update_payment_status(order: Order, payment_status: str) -> Order:
        order.payment_status = payment_status
        order.save(update_fields=["payment_status", "updated_at"])
        return order
