from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models

from apps.users.models import User

from .base import BaseModel, TimeStampedModel
from .order import Order


class PaymentMethod(models.TextChoices):
    CASH = "cash", "Cash"
    CARD = "card", "Credit/Debit Card"
    BANK_TRANSFER = "bank_transfer", "Bank Transfer"
    PAYPAL = "paypal", "PayPal"
    STRIPE = "stripe", "Stripe"
    OTHER = "other", "Other"


class PaymentStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    PROCESSING = "processing", "Processing"
    COMPLETED = "completed", "Completed"
    FAILED = "failed", "Failed"
    REFUNDED = "refunded", "Refunded"
    CANCELLED = "cancelled", "Cancelled"


class Payment(BaseModel, TimeStampedModel):
    """Платежи за заказы"""

    order = models.ForeignKey(
        Order,
        on_delete=models.PROTECT,
        related_name="payments",
        verbose_name="Order",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="payments",
        verbose_name="User",
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
        verbose_name="Amount",
        help_text="Payment amount",
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        verbose_name="Payment Method",
    )
    status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
        db_index=True,
        verbose_name="Payment Status",
    )
    transaction_id = models.CharField(
        max_length=255,
        blank=True,
        db_index=True,
        verbose_name="Transaction ID",
        help_text="External payment gateway transaction ID",
    )
    payment_gateway = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Payment Gateway",
        help_text="Name of payment gateway used (Stripe, PayPal, etc.)",
    )
    payment_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Payment Date",
        help_text="Date when payment was completed",
    )
    refund_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
        verbose_name="Refund Amount",
    )
    refund_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Refund Date",
    )
    notes = models.TextField(
        blank=True,
        verbose_name="Notes",
        help_text="Internal notes about the payment",
    )
    metadata = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Metadata",
        help_text="Additional payment data from gateway",
    )

    def __str__(self):
        return f"Payment #{self.id} - {self.order.order_number} - ${self.amount}"

    def is_successful(self):
        """Check if payment was successful"""
        return self.status == PaymentStatus.COMPLETED

    def can_refund(self):
        """Check if payment can be refunded"""
        return (
            self.status == PaymentStatus.COMPLETED
            and self.refund_amount < self.amount
        )

    class Meta:
        verbose_name = "Payment"
        verbose_name_plural = "Payments"
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["order", "status"]),
            models.Index(fields=["user", "status"]),
            models.Index(fields=["transaction_id"]),
            models.Index(fields=["payment_date"]),
        ]
