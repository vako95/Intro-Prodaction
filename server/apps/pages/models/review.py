from django.db import models
from ckeditor.fields import RichTextField
from django.contrib.auth import get_user_model
from django.core.validators import MinLengthValidator
from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin


User = get_user_model()


class Review(BaseModel, TimeStampedModel):

    message = RichTextField(
        blank=False,
        null=False,
        validators=[MinLengthValidator(10)],
        verbose_name="Message",
        help_text="Enter a Message (minimum 10 characters)",
    )

    message_az = RichTextField(
        blank=True,
        null=True,
        validators=[MinLengthValidator(10)],
        verbose_name="Message (Azerbaijani)",
        help_text="Enter a Message in Azerbaijani (minimum 10 characters)",
    )

    message_ru = RichTextField(
        blank=True,
        null=True,
        validators=[MinLengthValidator(10)],
        verbose_name="Message (Russian)",
        help_text="Enter a Message in Russian (minimum 10 characters)",
    )

    message_en = RichTextField(
        blank=True,
        null=True,
        validators=[MinLengthValidator(10)],
        verbose_name="Message (English)",
        help_text="Enter a Message in English (minimum 10 characters)",
    )

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reviews",
        verbose_name="Author",
        help_text="The user who wrote the review.",
    )

    def __str__(self):
        return f"{self.message[:50]} - {self.author.username}"

    class Meta:
        verbose_name = "Review"
        verbose_name_plural = "Reviews"
        ordering = ("-created_at",)


class ReviewRating(models.Model):
    RATING_CHOICES = [(i, f"{i} ⭐") for i in range(1, 6)]

    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name="ratings",
    )

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="review_ratings",
    )

    rating = models.PositiveSmallIntegerField(
        choices=RATING_CHOICES,
        verbose_name="Rating",
        help_text="Select a rating between 1 and 5 stars",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At",
        help_text="The date and time when the rating was created.",
    )

    class Meta:
        db_table = "review_ratings"
        constraints = [
            models.UniqueConstraint(
                fields=["review", "author"],
                name="unique_review_author_rating",
            )
        ]

    def __str__(self):
        return f"{self.author.username} → {self.rating}"
