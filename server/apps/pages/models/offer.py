from decimal import Decimal

from django.core.validators import (
    FileExtensionValidator,
    MaxValueValidator,
    MinValueValidator,
)
from django.db import models
from django.utils import timezone
from imagekit.models import ProcessedImageField

from apps.shop.models import Room

from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin
from ..utils import upload_to


class OfferType(models.TextChoices):
    EARLY_BOOKING = "early_booking", "Early Booking"
    LAST_MINUTE = "last_minute", "Last Minute"
    WEEKEND = "weekend", "Weekend Special"
    SEASONAL = "seasonal", "Seasonal"
    PACKAGE = "package", "Package Deal"
    OTHER = "other", "Other"


class SpecialOffer(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "title_en"

    title_en = models.CharField(
        max_length=255,
        verbose_name="Title (English)",
        help_text="e.g., Early Booking -20%, Weekend Getaway",
    )
    title_ru = models.CharField(
        max_length=255,
        verbose_name="Title (Russian)",
        help_text="Offer title in Russian",
    )
    title_az = models.CharField(
        max_length=255,
        verbose_name="Title (Azerbaijani)",
        help_text="Offer title in Azerbaijani",
    )
    subtitle_en = models.CharField(
        max_length=500,
        blank=True,
        verbose_name="Subtitle (English)",
        help_text="Short promotional text",
    )
    subtitle_ru = models.CharField(
        max_length=500,
        blank=True,
        verbose_name="Subtitle (Russian)",
        help_text="Short promotional text",
    )
    subtitle_az = models.CharField(
        max_length=500,
        blank=True,
        verbose_name="Subtitle (Azerbaijani)",
        help_text="Short promotional text",
    )
    description_en = models.TextField(
        verbose_name="Description (English)",
        help_text="Detailed offer description",
    )
    description_ru = models.TextField(
        verbose_name="Description (Russian)",
        help_text="Detailed offer description",
    )
    description_az = models.TextField(
        verbose_name="Description (Azerbaijani)",
        help_text="Detailed offer description",
    )
    offer_type = models.CharField(
        max_length=20,
        choices=OfferType.choices,
        default=OfferType.OTHER,
        db_index=True,
        verbose_name="Offer Type",
    )
    discount_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(Decimal("0.00")),
            MaxValueValidator(Decimal("100.00")),
        ],
        verbose_name="Discount Percentage",
        help_text="Discount percentage (0-100)",
    )
    valid_from = models.DateTimeField(
        verbose_name="Valid From",
        help_text="Offer start date and time",
    )
    valid_to = models.DateTimeField(
        verbose_name="Valid To",
        help_text="Offer end date and time",
    )
    image = ProcessedImageField(
        upload_to=upload_to("offers/%Y/%m/%d/"),
        validators=[
            FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png", "webp"])
        ],
        format="WEBP",
        options={"quality": 85},
        verbose_name="Offer Image",
        help_text="Promotional image for the offer",
    )
    rooms = models.ManyToManyField(
        Room,
        blank=True,
        related_name="special_offers",
        verbose_name="Applicable Rooms",
        help_text="Leave empty to apply to all rooms",
    )
    terms_conditions_en = models.TextField(
        blank=True,
        verbose_name="Terms & Conditions (English)",
        help_text="Offer terms and conditions",
    )
    terms_conditions_ru = models.TextField(
        blank=True,
        verbose_name="Terms & Conditions (Russian)",
        help_text="Offer terms and conditions",
    )
    terms_conditions_az = models.TextField(
        blank=True,
        verbose_name="Terms & Conditions (Azerbaijani)",
        help_text="Offer terms and conditions",
    )
    is_featured = models.BooleanField(
        default=False,
        db_index=True,
        verbose_name="Featured",
        help_text="Show on homepage or featured section",
    )
    order = models.PositiveIntegerField(
        default=0,
        db_index=True,
        verbose_name="Display Order",
        help_text="Order in which offer appears",
    )

    def __str__(self):
        return f"{self.title_en} ({self.discount_percentage}% off)"

    def is_valid(self):
        """Check if offer is currently valid"""
        now = timezone.now()
        return self.is_active and self.valid_from <= now <= self.valid_to

    def days_remaining(self):
        """Calculate days remaining until offer expires"""
        if not self.is_valid():
            return 0
        delta = self.valid_to - timezone.now()
        return max(0, delta.days)

    class Meta:
        verbose_name = "Special Offer"
        verbose_name_plural = "Special Offers"
        ordering = ("-is_featured", "order", "-created_at")
        indexes = [
            models.Index(fields=["is_active", "is_featured"]),
            models.Index(fields=["valid_from", "valid_to"]),
            models.Index(fields=["offer_type"]),
        ]
