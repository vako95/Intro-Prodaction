from django.core.validators import MaxValueValidator, MinLengthValidator, MinValueValidator
from django.db import models

from apps.users.models import User

from .base import BaseModel, TimeStampedModel
from .order import Order
from .room import Room


class RoomReview(BaseModel, TimeStampedModel):
    """Отзывы о номерах отеля"""

    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="reviews",
        verbose_name="Room",
        help_text="Room being reviewed",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="room_reviews",
        verbose_name="User",
        help_text="User who wrote the review",
    )
    order = models.ForeignKey(
        Order,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="room_reviews",
        verbose_name="Order",
        help_text="Related booking order (if verified)",
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Rating",
        help_text="Rating from 1 to 5 stars",
    )
    title = models.CharField(
        max_length=255,
        verbose_name="Review Title",
        help_text="Short title for the review",
    )
    comment = models.TextField(
        validators=[MinLengthValidator(20)],
        verbose_name="Comment",
        help_text="Detailed review (minimum 20 characters)",
    )
    pros = models.TextField(
        blank=True,
        verbose_name="Pros",
        help_text="What did you like?",
    )
    cons = models.TextField(
        blank=True,
        verbose_name="Cons",
        help_text="What could be improved?",
    )
    is_verified = models.BooleanField(
        default=False,
        db_index=True,
        verbose_name="Verified Purchase",
        help_text="User actually booked this room",
    )
    is_approved = models.BooleanField(
        default=False,
        db_index=True,
        verbose_name="Approved",
        help_text="Review approved by admin",
    )
    helpful_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Helpful Count",
        help_text="Number of users who found this review helpful",
    )

    def __str__(self):
        stars = "⭐" * self.rating
        return f"{self.user.username} - {self.room.title_en} ({stars})"

    def save(self, *args, **kwargs):
        # Auto-verify if order exists
        if self.order and not self.is_verified:
            self.is_verified = True
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Room Review"
        verbose_name_plural = "Room Reviews"
        ordering = ("-created_at",)
        unique_together = ("user", "room", "order")
        indexes = [
            models.Index(fields=["room", "is_approved"]),
            models.Index(fields=["user", "created_at"]),
            models.Index(fields=["rating", "is_approved"]),
            models.Index(fields=["is_verified", "is_approved"]),
        ]


class ReviewHelpful(BaseModel, TimeStampedModel):
    """Отметки полезности отзывов"""

    review = models.ForeignKey(
        RoomReview,
        on_delete=models.CASCADE,
        related_name="helpful_votes",
        verbose_name="Review",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="helpful_votes",
        verbose_name="User",
    )

    def __str__(self):
        return f"{self.user.username} found review #{self.review.id} helpful"

    class Meta:
        verbose_name = "Review Helpful Vote"
        verbose_name_plural = "Review Helpful Votes"
        unique_together = ("review", "user")
        indexes = [
            models.Index(fields=["review", "user"]),
        ]
