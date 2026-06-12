from dataclasses import dataclass
from datetime import date, datetime, time
from typing import Optional

from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Q, Sum
from django.utils import timezone

from apps.shop.models import Room, RoomOrder


@dataclass
class HotelPolicy:
    check_in_time: time = time(14, 0)
    check_out_time: time = time(12, 0)


class BookingService:
    ACTIVE_STATUSES = ["pending", "confirmed"]
    CANCELLED_STATUSES = ["cancelled", "rejected", "abort"]

    @staticmethod
    def validate_dates(check_in: date, check_out: date) -> None:
        today = timezone.now().date()
        
        if check_in < today:
            raise ValidationError("Check-in cannot be in the past")
        
        if check_out <= check_in:
            raise ValidationError("Check-out must be after check-in")

    @staticmethod
    def normalize_dates(
        check_in: date,
        check_out: date,
        policy: Optional[HotelPolicy] = None,
    ) -> tuple[datetime, datetime]:
        policy = policy or HotelPolicy()
        
        check_in_dt = timezone.make_aware(
            datetime.combine(check_in, policy.check_in_time)
        )
        check_out_dt = timezone.make_aware(
            datetime.combine(check_out, policy.check_out_time)
        )
        
        return check_in_dt, check_out_dt

    @staticmethod
    def calculate_nights(check_in: date, check_out: date) -> int:
        return (check_out - check_in).days

    @staticmethod
    def validate_capacity(room: Room, adults: int, children: int) -> None:
        total_guests = adults + children
        
        if total_guests < 1:
            raise ValidationError("At least 1 guest is required")
        
        if total_guests > room.capacity_total:
            raise ValidationError(
                f"Room capacity is {room.capacity_total}, but {total_guests} guests requested"
            )

    @staticmethod
    def check_availability(
        room: Room,
        check_in: date,
        check_out: date,
        rooms_count: int = 1,
        exclude_order_id: Optional[int] = None,
    ) -> None:
        overlapping_orders = room.orders.filter(
            Q(check_in__lt=check_out) & Q(check_out__gt=check_in),
            status__in=BookingService.ACTIVE_STATUSES,
        )
        
        if exclude_order_id:
            overlapping_orders = overlapping_orders.exclude(pk=exclude_order_id)

        booked_rooms = overlapping_orders.aggregate(
            total=Sum("rooms_reserved")
        )["total"] or 0
        
        available_rooms = room.room_count - booked_rooms

        if available_rooms < rooms_count:
            raise ValidationError(
                f"Only {available_rooms} rooms available, but {rooms_count} requested"
            )

    @staticmethod
    @transaction.atomic
    def create_booking(
        room_id: int,
        check_in: date,
        check_out: date,
        adults: int,
        children: int,
        user,
        rooms_count: int = 1,
        coupon_code: Optional[str] = None,
    ) -> RoomOrder:
        from apps.shop.models import Coupon
        
        BookingService.validate_dates(check_in, check_out)
        
        room = Room.objects.select_for_update().get(pk=room_id, is_active=True)
        
        BookingService.validate_capacity(room, adults, children)
        BookingService.check_availability(room, check_in, check_out, rooms_count)

        coupon = None
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code.upper(), is_active=True)
                nights = BookingService.calculate_nights(check_in, check_out)
                order_amount = room.final_price * rooms_count * nights
                
                can_use, message = coupon.can_use(user, order_amount)
                if not can_use:
                    raise ValidationError(message)
                
                if coupon.rooms.exists() and not coupon.rooms.filter(id=room_id).exists():
                    raise ValidationError("Coupon is not applicable to this room")
                    
            except Coupon.DoesNotExist:
                raise ValidationError("Invalid coupon code")

        order = room.orders.create(
            user=user,
            check_in=check_in,
            check_out=check_out,
            adults=adults,
            children=children,
            rooms_reserved=rooms_count,
            coupon=coupon,
        )
        
        if coupon:
            coupon.usage_count += 1
            coupon.save(update_fields=["usage_count"])
        
        return order

    @staticmethod
    @transaction.atomic
    def cancel_booking(order: RoomOrder) -> RoomOrder:
        if order.status in BookingService.CANCELLED_STATUSES:
            raise ValidationError("Order is already cancelled")

        if order.check_in <= timezone.now().date():
            raise ValidationError("Cannot cancel order on check-in day or after")

        order.status = "cancelled"
        order.save(update_fields=["status", "updated_at"])
        return order

    @staticmethod
    def calculate_price(
        room: Room,
        check_in: date,
        check_out: date,
        rooms_count: int = 1,
    ) -> dict:
        nights = BookingService.calculate_nights(check_in, check_out)
        discount_amount = room.price * (room.discount / 100)
        subtotal = room.final_price * nights
        total = subtotal * rooms_count

        return {
            "base_price_per_night": float(room.price),
            "discount_percentage": room.discount,
            "discount_amount_per_night": float(discount_amount),
            "final_price_per_night": float(room.final_price),
            "nights": nights,
            "subtotal_per_room": float(subtotal),
            "rooms_count": rooms_count,
            "total": float(total),
        }
