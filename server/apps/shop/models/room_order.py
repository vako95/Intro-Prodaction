from django.core.validators import MinValueValidator
from django.db import models

from apps.users.models import User

from .base import BaseModel, TimeStampedModel
from .room import Room


class RoomOrderStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    CONFIRMED = "confirmed", "Confirmed"
    CANCELLED = "cancelled", "Cancelled"
    REJECTED = "rejected", "Rejected"
    ABORT = "abort", "Aborted"


class RoomOrder(BaseModel, TimeStampedModel):
    room = models.ForeignKey(
        Room,
        on_delete=models.PROTECT,
        related_name="orders",
        verbose_name="Room",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="room_orders",
        verbose_name="User",
    )
    adults = models.PositiveSmallIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name="Number of Adults",
        help_text="Enter how many adults will stay in the room",
    )
    children = models.PositiveSmallIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        verbose_name="Number of Children",
        help_text="Enter how many children will stay in the room",
    )
    check_in = models.DateField(
        db_index=True,
        verbose_name="Check-in Date",
        help_text="Select the start date of stay",
    )
    check_out = models.DateField(
        db_index=True,
        verbose_name="Check-out Date",
        help_text="Select the end date of stay",
    )
    rooms_reserved = models.PositiveSmallIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name="Rooms Reserved",
        help_text="How many rooms of this type are booked",
    )
    status = models.CharField(
        max_length=20,
        choices=RoomOrderStatus.choices,
        default=RoomOrderStatus.PENDING,
        db_index=True,
        verbose_name="Order Status",
    )
    coupon = models.ForeignKey(
        "Coupon",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="room_orders",
        verbose_name="Coupon",
        help_text="Applied coupon for this order",
    )

    def __str__(self):
        return f"{self.room} | {self.user} | {self.check_in} → {self.check_out}"

    class Meta:
        verbose_name = "Room Order"
        verbose_name_plural = "Room Orders"
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["room", "check_in", "check_out"]),
            models.Index(fields=["status", "check_in"]),
        ]
