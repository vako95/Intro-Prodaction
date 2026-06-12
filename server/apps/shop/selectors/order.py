from typing import Optional

from django.db.models import Count, Q, QuerySet

from apps.shop.models import RoomOrder
from apps.users.models import User


class OrderSelector:
    RELATED_FIELDS = ["room", "user"]

    @staticmethod
    def get_user_orders(user: User, status: Optional[str] = None) -> QuerySet[RoomOrder]:
        queryset = RoomOrder.objects.filter(user=user).select_related(
            *OrderSelector.RELATED_FIELDS
        ).order_by("-created_at")

        if status:
            queryset = queryset.filter(status=status)

        return queryset

    @staticmethod
    def get_order_by_id(order_id: int, user: User) -> Optional[RoomOrder]:
        try:
            return RoomOrder.objects.select_related(
                *OrderSelector.RELATED_FIELDS
            ).get(pk=order_id, user=user)
        except RoomOrder.DoesNotExist:
            return None

    @staticmethod
    def get_user_order_stats(user: User) -> dict:
        stats = (
            RoomOrder.objects.filter(user=user)
            .values("status")
            .annotate(count=Count("id"))
        )

        status_counts = {item["status"]: item["count"] for item in stats}

        return {
            "total_orders": sum(status_counts.values()),
            "pending": status_counts.get("pending", 0),
            "confirmed": status_counts.get("confirmed", 0),
            "cancelled": status_counts.get("cancelled", 0),
            "rejected": status_counts.get("rejected", 0),
        }
