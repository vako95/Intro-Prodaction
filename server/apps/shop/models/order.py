from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models

from apps.users.models import User

from .base import BaseModel, TimeStampedModel
from .room import Room


class OrderStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    CONFIRMED = "confirmed", "Confirmed"
    CANCELLED = "cancelled", "Cancelled"
    COMPLETED = "completed", "Completed"


class PaymentStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    PAID = "paid", "Paid"
    FAILED = "failed", "Failed"
    REFUNDED = "refunded", "Refunded"


class Order(BaseModel, TimeStampedModel):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders",
        verbose_name="User",
    )
    order_number = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        verbose_name="Order Number",
    )
    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
        db_index=True,
        verbose_name="Order Status",
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
        db_index=True,
        verbose_name="Payment Status",
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
        verbose_name="Total Amount",
    )
    coupon = models.ForeignKey(
        "Coupon",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders",
        verbose_name="Coupon",
    )
    discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
        verbose_name="Discount Amount",
    )
    final_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
        verbose_name="Final Amount",
        help_text="Total amount after discount",
    )
    notes = models.TextField(
        blank=True,
        verbose_name="Order Notes",
    )

    def __str__(self):
        return f"Order {self.order_number} - {self.user}"

    def calculate_final_amount(self):
        """Calculate final amount after discount"""
        self.final_amount = self.total_amount - self.discount_amount
        return self.final_amount

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Orders"
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["status", "payment_status"]),
            models.Index(fields=["created_at"]),
        ]


class OrderItem(BaseModel, TimeStampedModel):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
        verbose_name="Order",
    )
    room = models.ForeignKey(
        Room,
        on_delete=models.PROTECT,
        related_name="order_items",
        verbose_name="Room",
    )
    check_in = models.DateField(
        db_index=True,
        verbose_name="Check-in Date",
    )
    check_out = models.DateField(
        db_index=True,
        verbose_name="Check-out Date",
    )
    adults = models.PositiveSmallIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name="Number of Adults",
    )
    children = models.PositiveSmallIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        verbose_name="Number of Children",
    )
    rooms_count = models.PositiveSmallIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name="Number of Rooms",
    )
    price_per_night = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
        verbose_name="Price Per Night",
    )
    nights = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1)],
        verbose_name="Number of Nights",
    )
    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
        verbose_name="Subtotal",
    )

    def __str__(self):
        return f"{self.room} x{self.rooms_count} ({self.check_in} - {self.check_out})"

    class Meta:
        verbose_name = "Order Item"
        verbose_name_plural = "Order Items"
        ordering = ("created_at",)
        indexes = [
            models.Index(fields=["order", "room"]),
            models.Index(fields=["check_in", "check_out"]),
        ]


class OrderStatusHistory(BaseModel, TimeStampedModel):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="status_history",
        verbose_name="Order",
    )
    old_status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        verbose_name="Old Status",
    )
    new_status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        verbose_name="New Status",
    )
    changed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="order_status_changes",
        verbose_name="Changed By",
    )
    reason = models.TextField(
        blank=True,
        verbose_name="Reason",
    )

    def __str__(self):
        return f"{self.order.order_number}: {self.old_status} → {self.new_status}"

    class Meta:
        verbose_name = "Order Status History"
        verbose_name_plural = "Order Status Histories"
        ordering = ("-created_at",)
