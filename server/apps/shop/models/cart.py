from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.contrib.auth import get_user_model
from .base import BaseModel, TimeStampedModel
from .room import Room

User = get_user_model()


class Cart(BaseModel, TimeStampedModel):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="cart",
        verbose_name="User",
        help_text="Cart User",
    )

    def __str__(self):
        return f"Cart for {self.user}"

    @property
    def total_items(self):
        return self.items.count()

    @property
    def total_price(self):
        return sum(item.subtotal for item in self.items.all())

    class Meta:
        verbose_name = "Cart"
        verbose_name_plural = "Carts"


class CartItem(BaseModel, TimeStampedModel):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items",
        verbose_name="Cart",
    )

    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="cart_items",
        verbose_name="Room",
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

    check_in = models.DateField(
        db_index=True,
        verbose_name="Check-in Date",
    )

    check_out = models.DateField(
        db_index=True,
        verbose_name="Check-out Date",
    )

    rooms_count = models.PositiveSmallIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name="Number of Rooms",
    )

    def clean(self):
        today = timezone.now().date()

        if self.check_in < today:
            raise ValidationError("Check-in date cannot be in the past")

        if self.check_out <= self.check_in:
            raise ValidationError("Check-out must be after check-in")

        if self.adults + self.children > self.room.capacity_total:
            raise ValidationError("Guest count exceeds room capacity")

    @property
    def nights(self):
        return (self.check_out - self.check_in).days

    @property
    def subtotal(self):
        return self.room.final_price * self.nights * self.rooms_count

    def __str__(self):
        return f"{self.room} x{self.rooms_count} ({self.check_in} - {self.check_out})"

    class Meta:
        verbose_name = "Cart Item"
        verbose_name_plural = "Cart Items"
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["cart", "room"]),
        ]
