from datetime import date
from typing import Optional

from django.db.models import Q, QuerySet, Sum, F

from apps.shop.models import Room


class RoomSelector:
    PREFETCH_FIELDS = ["icons", "images"]
    ACTIVE_STATUSES = ["pending", "confirmed"]

    @staticmethod
    def get_active_rooms() -> QuerySet[Room]:
        return (
            Room.objects.filter(is_active=True)
            .prefetch_related(*RoomSelector.PREFETCH_FIELDS)
            .order_by("-created_at")
        )

    @staticmethod
    def get_room_by_slug(slug: str) -> Optional[Room]:
        try:
            return Room.objects.prefetch_related(*RoomSelector.PREFETCH_FIELDS).get(
                slug=slug, is_active=True
            )
        except Room.DoesNotExist:
            return None

    @staticmethod
    def get_room_by_id(room_id: int) -> Optional[Room]:
        try:
            return Room.objects.get(pk=room_id, is_active=True)
        except Room.DoesNotExist:
            return None

    @staticmethod
    def filter_rooms(
        search: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        capacity: Optional[int] = None,
    ) -> QuerySet[Room]:
        queryset = RoomSelector.get_active_rooms()

        if search:
            queryset = queryset.filter(
                Q(title_en__icontains=search)
                | Q(title_az__icontains=search)
                | Q(title_ru__icontains=search)
            )

        if min_price is not None:
            queryset = queryset.filter(price__gte=min_price)

        if max_price is not None:
            queryset = queryset.filter(price__lte=max_price)

        if capacity is not None:
            queryset = queryset.filter(capacity_adult__gte=capacity)

        return queryset

    @staticmethod
    def get_available_rooms_count(room: Room, check_in: date, check_out: date) -> int:
        from apps.shop.models import OrderItem
        
        booked_rooms = (
            OrderItem.objects.filter(
                room=room,
                order__status__in=RoomSelector.ACTIVE_STATUSES,
            )
            .filter(
                Q(check_in__lt=check_out) & Q(check_out__gt=check_in)
            )
            .aggregate(total=Sum("rooms_count"))["total"]
            or 0
        )

        return room.room_count - booked_rooms

    @staticmethod
    def search_available_rooms(
        check_in: date,
        check_out: date,
        adults: int = 1,
        children: int = 0,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
    ) -> list[Room]:
        total_guests = adults + children

        queryset = Room.objects.filter(is_active=True).annotate(
            total_capacity=F('capacity_adult') + F('capacity_children')
        ).filter(total_capacity__gte=total_guests)
        
        if min_price is not None:
            queryset = queryset.filter(price__gte=min_price)
        
        if max_price is not None:
            queryset = queryset.filter(price__lte=max_price)
        
        rooms = queryset.prefetch_related(*RoomSelector.PREFETCH_FIELDS)

        available_rooms = []

        for room in rooms:
            available_count = RoomSelector.get_available_rooms_count(
                room, check_in, check_out
            )

            if available_count > 0:
                room.available_count = available_count
                available_rooms.append(room)

        return available_rooms
