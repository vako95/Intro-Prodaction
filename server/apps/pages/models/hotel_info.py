from django.core.validators import EmailValidator, FileExtensionValidator
from django.db import models
from imagekit.models import ProcessedImageField

from .base import BaseModel, TimeStampedModel
from ..utils import upload_to


class HotelInfo(BaseModel, TimeStampedModel):
    """
    Основная информация об отеле (Singleton - должна быть только одна запись)
    Используется в About секции, Footer, Contact странице
    """

    # Basic Information
    hotel_name_en = models.CharField(
        max_length=255,
        default="Hoexr Luxury Hotel",
        verbose_name="Hotel Name (English)",
        help_text="Official hotel name",
    )
    hotel_name_ru = models.CharField(
        max_length=255,
        default="Отель Hoexr",
        verbose_name="Hotel Name (Russian)",
        help_text="Official hotel name in Russian",
    )
    hotel_name_az = models.CharField(
        max_length=255,
        default="Hoexr Otel",
        verbose_name="Hotel Name (Azerbaijani)",
        help_text="Official hotel name in Azerbaijani",
    )
    tagline_en = models.CharField(
        max_length=500,
        blank=True,
        verbose_name="Tagline (English)",
        help_text="e.g., Most Safe & Rated Hotel in London",
    )
    tagline_ru = models.CharField(
        max_length=500,
        blank=True,
        verbose_name="Tagline (Russian)",
        help_text="Hotel tagline in Russian",
    )
    tagline_az = models.CharField(
        max_length=500,
        blank=True,
        verbose_name="Tagline (Azerbaijani)",
        help_text="Hotel tagline in Azerbaijani",
    )

    # About Section
    about_title_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="About Title (English)",
        help_text="Title for About section",
    )
    about_title_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="About Title (Russian)",
        help_text="Title for About section",
    )
    about_title_az = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="About Title (Azerbaijani)",
        help_text="Title for About section",
    )
    about_description_en = models.TextField(
        blank=True,
        verbose_name="About Description (English)",
        help_text="Detailed description of the hotel",
    )
    about_description_ru = models.TextField(
        blank=True,
        verbose_name="About Description (Russian)",
        help_text="Detailed description of the hotel",
    )
    about_description_az = models.TextField(
        blank=True,
        verbose_name="About Description (Azerbaijani)",
        help_text="Detailed description of the hotel",
    )

    # Contact Information
    phone_primary = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Primary Phone",
        help_text="Main contact phone number",
    )
    phone_secondary = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Secondary Phone",
        help_text="Alternative phone number",
    )
    email_primary = models.EmailField(
        blank=True,
        validators=[EmailValidator()],
        verbose_name="Primary Email",
        help_text="Main contact email",
    )
    email_support = models.EmailField(
        blank=True,
        validators=[EmailValidator()],
        verbose_name="Support Email",
        help_text="Support/help email",
    )
    address_en = models.TextField(
        blank=True,
        verbose_name="Address (English)",
        help_text="Full hotel address",
    )
    address_ru = models.TextField(
        blank=True,
        verbose_name="Address (Russian)",
        help_text="Full hotel address in Russian",
    )
    address_az = models.TextField(
        blank=True,
        verbose_name="Address (Azerbaijani)",
        help_text="Full hotel address in Azerbaijani",
    )
    
    # Location Coordinates
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True,
        verbose_name="Latitude",
        help_text="Hotel location latitude",
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True,
        verbose_name="Longitude",
        help_text="Hotel location longitude",
    )

    # Social Media
    facebook_url = models.URLField(
        blank=True,
        verbose_name="Facebook URL",
        help_text="Facebook page URL",
    )
    instagram_url = models.URLField(
        blank=True,
        verbose_name="Instagram URL",
        help_text="Instagram profile URL",
    )
    twitter_url = models.URLField(
        blank=True,
        verbose_name="Twitter URL",
        help_text="Twitter profile URL",
    )
    youtube_url = models.URLField(
        blank=True,
        verbose_name="YouTube URL",
        help_text="YouTube channel URL",
    )
    linkedin_url = models.URLField(
        blank=True,
        verbose_name="LinkedIn URL",
        help_text="LinkedIn page URL",
    )

    # Working Hours & Policies
    check_in_time = models.TimeField(
        default="14:00",
        verbose_name="Check-in Time",
        help_text="Standard check-in time",
    )
    check_out_time = models.TimeField(
        default="12:00",
        verbose_name="Check-out Time",
        help_text="Standard check-out time",
    )
    reception_hours = models.CharField(
        max_length=100,
        default="24/7",
        verbose_name="Reception Hours",
        help_text="Reception working hours",
    )

    # Images
    about_image = ProcessedImageField(
        upload_to=upload_to("hotel_info/about/"),
        validators=[
            FileExtensionValidator(
                allowed_extensions=["jpg", "jpeg", "png", "webp"]
            )
        ],
        format="WEBP",
        options={"quality": 85},
        blank=True,
        null=True,
        verbose_name="About Section Image",
        help_text="Image for About section",
    )
    footer_logo = ProcessedImageField(
        upload_to=upload_to("hotel_info/logo/"),
        validators=[
            FileExtensionValidator(
                allowed_extensions=["jpg", "jpeg", "png", "webp", "svg"]
            )
        ],
        format="WEBP",
        options={"quality": 90},
        blank=True,
        null=True,
        verbose_name="Footer Logo",
        help_text="Logo for footer",
    )

    # Footer Content
    footer_description_en = models.TextField(
        blank=True,
        verbose_name="Footer Description (English)",
        help_text="Short description for footer",
    )
    footer_description_ru = models.TextField(
        blank=True,
        verbose_name="Footer Description (Russian)",
        help_text="Short description for footer",
    )
    footer_description_az = models.TextField(
        blank=True,
        verbose_name="Footer Description (Azerbaijani)",
        help_text="Short description for footer",
    )

    # SEO
    meta_title_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Meta Title (English)",
        help_text="SEO meta title",
    )
    meta_title_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Meta Title (Russian)",
        help_text="SEO meta title",
    )
    meta_title_az = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Meta Title (Azerbaijani)",
        help_text="SEO meta title",
    )
    meta_description_en = models.TextField(
        blank=True,
        verbose_name="Meta Description (English)",
        help_text="SEO meta description",
    )
    meta_description_ru = models.TextField(
        blank=True,
        verbose_name="Meta Description (Russian)",
        help_text="SEO meta description",
    )
    meta_description_az = models.TextField(
        blank=True,
        verbose_name="Meta Description (Azerbaijani)",
        help_text="SEO meta description",
    )

    def __str__(self):
        return f"Hotel Info: {self.hotel_name_en}"

    def save(self, *args, **kwargs):
        """Ensure only one instance exists (Singleton pattern)"""
        if not self.pk and HotelInfo.objects.exists():
            # If trying to create a new instance when one already exists
            raise ValueError(
                "Only one HotelInfo instance is allowed. Please edit the existing one."
            )
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Hotel Information"
        verbose_name_plural = "Hotel Information"
