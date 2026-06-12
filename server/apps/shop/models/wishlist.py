from django.db import models

from apps.users.models import User

from .base import BaseModel, TimeStampedModel
from .room import Room


class Wishlist(BaseModel, TimeStampedModel):
    """Избранные номера пользователя"""

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="wishlist_items",
        verbose_name="User",
    )
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="wishlisted_by",
        verbose_name="Room",
    )

    def __str__(self):
        return f"{self.user.username} - {self.room.title_en}"

    class Meta:
        verbose_name = "Wishlist Item"
        verbose_name_plural = "Wishlist Items"
        ordering = ("-created_at",)
        unique_together = ("user", "room")
        indexes = [
            models.Index(fields=["user", "created_at"]),
        ]
