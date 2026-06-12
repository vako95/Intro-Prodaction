from django.core.validators import MinLengthValidator
from django.db import models

from .base import BaseModel, TimeStampedModel


class FAQCategory(models.TextChoices):
    BOOKING = "booking", "Booking"
    PAYMENT = "payment", "Payment"
    ROOMS = "rooms", "Rooms"
    SERVICES = "services", "Services"
    POLICIES = "policies", "Policies"
    GENERAL = "general", "General"


class FAQ(BaseModel, TimeStampedModel):
    """Часто задаваемые вопросы"""

    question_en = models.CharField(
        max_length=500,
        verbose_name="Question (English)",
        help_text="Enter the question in English",
    )
    question_ru = models.CharField(
        max_length=500,
        verbose_name="Question (Russian)",
        help_text="Enter the question in Russian",
    )
    question_az = models.CharField(
        max_length=500,
        verbose_name="Question (Azerbaijani)",
        help_text="Enter the question in Azerbaijani",
    )
    answer_en = models.TextField(
        validators=[MinLengthValidator(10)],
        verbose_name="Answer (English)",
        help_text="Enter the answer in English",
    )
    answer_ru = models.TextField(
        validators=[MinLengthValidator(10)],
        verbose_name="Answer (Russian)",
        help_text="Enter the answer in Russian",
    )
    answer_az = models.TextField(
        validators=[MinLengthValidator(10)],
        verbose_name="Answer (Azerbaijani)",
        help_text="Enter the answer in Azerbaijani",
    )
    category = models.CharField(
        max_length=20,
        choices=FAQCategory.choices,
        default=FAQCategory.GENERAL,
        db_index=True,
        verbose_name="Category",
        help_text="Select the FAQ category",
    )
    order = models.PositiveIntegerField(
        default=0,
        db_index=True,
        verbose_name="Display Order",
        help_text="Order in which FAQ appears (lower numbers first)",
    )

    def __str__(self):
        return f"{self.get_category_display()}: {self.question_en[:50]}"

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"
        ordering = ("category", "order", "created_at")
        indexes = [
            models.Index(fields=["category", "order"]),
            models.Index(fields=["is_active", "category"]),
        ]
