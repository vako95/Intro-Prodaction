from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone

from .base import BaseModel, TimeStampedModel
from .room import Room


class CouponType(models.TextChoices):
    PERCENTAGE = "percentage", "Percentage"
    FIXED = "fixed", "Fixed Amount"


class Coupon(BaseModel, TimeStampedModel):
    """Купоны и промокоды"""

    code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        verbose_name="Coupon Code",
        help_text="Unique coupon code (e.g., SUMMER2024)",
    )
    coupon_type = models.CharField(
        max_length=20,
        choices=CouponType.choices,
        default=CouponType.PERCENTAGE,
        verbose_name="Discount Type",
    )
    discount_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name="Discount Value",
        help_text="Percentage (0-100) or fixed amount",
    )
    min_order_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        verbose_name="Minimum Order Amount",
        help_text="Minimum order amount to use this coupon",
    )
    max_discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        verbose_name="Maximum Discount Amount",
        help_text="Maximum discount amount (for percentage coupons)",
    )
    valid_from = models.DateTimeField(
        verbose_name="Valid From",
        help_text="Coupon valid from this date",
    )
    valid_to = models.DateTimeField(
        verbose_name="Valid To",
        help_text="Coupon valid until this date",
    )
    usage_limit = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name="Usage Limit",
        help_text="Maximum number of times this coupon can be used (null = unlimited)",
    )
    usage_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Usage Count",
        help_text="Number of times this coupon has been used",
    )
    user_usage_limit = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name="Per User Usage Limit",
        help_text="Maximum times one user can use this coupon",
    )
    rooms = models.ManyToManyField(
        Room,
        blank=True,
        related_name="coupons",
        verbose_name="Applicable Rooms",
        help_text="Leave empty for all rooms",
    )
    description = models.TextField(
        blank=True,
        verbose_name="Description",
        help_text="Internal description of the coupon",
    )

    def __str__(self):
        return f"{self.code} ({self.get_discount_display()})"

    def get_discount_display(self):
        if self.coupon_type == CouponType.PERCENTAGE:
            return f"{self.discount_value}%"
        return f"${self.discount_value}"

    def is_valid(self):
        """Check if coupon is currently valid"""
        now = timezone.now()
        if now < self.valid_from or now > self.valid_to:
            return False
        if self.usage_limit and self.usage_count >= self.usage_limit:
            return False
        return self.is_active

    def can_use(self, user, order_amount):
        """Check if user can use this coupon for given order amount"""
        if not self.is_valid():
            return False, "Coupon is not valid"

        if order_amount < self.min_order_amount:
            return False, f"Minimum order amount is ${self.min_order_amount}"

        # Check user usage limit
        from .order import Order

        user_usage = Order.objects.filter(
            user=user, coupon=self, status__in=["confirmed", "completed"]
        ).count()

        if user_usage >= self.user_usage_limit:
            return False, "You have already used this coupon"

        return True, "Coupon is valid"

    def calculate_discount(self, order_amount):
        """Calculate discount amount for given order amount"""
        if self.coupon_type == CouponType.PERCENTAGE:
            discount = order_amount * (self.discount_value / 100)
            if self.max_discount_amount:
                discount = min(discount, self.max_discount_amount)
            return discount
        return min(self.discount_value, order_amount)

    class Meta:
        verbose_name = "Coupon"
        verbose_name_plural = "Coupons"
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["code", "is_active"]),
            models.Index(fields=["valid_from", "valid_to"]),
        ]
