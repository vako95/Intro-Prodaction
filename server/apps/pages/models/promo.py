from django.core.validators import FileExtensionValidator
from django.db import models
from imagekit.models import ProcessedImageField

from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin
from ..utils import upload_to


class PromoType(models.TextChoices):
    VIDEO = "video", "Video"
    BANNER = "banner", "Banner"
    CTA = "cta", "Call to Action"
    FEATURE = "feature", "Feature"


class PromoSection(BaseModel, TimeStampedModel, SlugMixin):
    """
    Промо-секции для главной страницы
    Например: промо-видео, баннеры, CTA блоки
    """

    slug_source_field = "title_en"

    section_type = models.CharField(
        max_length=20,
        choices=PromoType.choices,
        default=PromoType.BANNER,
        db_index=True,
        verbose_name="Section Type",
        help_text="Type of promotional section",
    )
    title_en = models.CharField(
        max_length=255,
        verbose_name="Title (English)",
        help_text="Main title for the promo section",
    )
    title_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Title (Russian)",
        help_text="Main title in Russian",
    )
    title_az = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Title (Azerbaijani)",
        help_text="Main title in Azerbaijani",
    )
    subtitle_en = models.CharField(
        max_length=500,
        blank=True,
        verbose_name="Subtitle (English)",
        help_text="Subtitle or tagline",
    )
    subtitle_ru = models.CharField(
        max_length=500,
        blank=True,
        verbose_name="Subtitle (Russian)",
        help_text="Subtitle or tagline",
    )
    subtitle_az = models.CharField(
        max_length=500,
        blank=True,
        verbose_name="Subtitle (Azerbaijani)",
        help_text="Subtitle or tagline",
    )
    description_en = models.TextField(
        blank=True,
        verbose_name="Description (English)",
        help_text="Detailed description",
    )
    description_ru = models.TextField(
        blank=True,
        verbose_name="Description (Russian)",
        help_text="Detailed description",
    )
    description_az = models.TextField(
        blank=True,
        verbose_name="Description (Azerbaijani)",
        help_text="Detailed description",
    )

    # Video (for video type)
    video_url = models.URLField(
        blank=True,
        verbose_name="Video URL",
        help_text="YouTube or Vimeo video URL",
    )
    video_thumbnail = ProcessedImageField(
        upload_to=upload_to("promo/video_thumbnails/"),
        validators=[
            FileExtensionValidator(
                allowed_extensions=["jpg", "jpeg", "png", "webp"]
            )
        ],
        format="WEBP",
        options={"quality": 85},
        blank=True,
        null=True,
        verbose_name="Video Thumbnail",
        help_text="Thumbnail image for video",
    )

    # Image (for banner/cta type)
    background_image = ProcessedImageField(
        upload_to=upload_to("promo/backgrounds/"),
        validators=[
            FileExtensionValidator(
                allowed_extensions=["jpg", "jpeg", "png", "webp"]
            )
        ],
        format="WEBP",
        options={"quality": 90},
        blank=True,
        null=True,
        verbose_name="Background Image",
        help_text="Background image for the section",
    )

    # Call to Action
    button_text_en = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Button Text (English)",
        help_text="Text for CTA button",
    )
    button_text_ru = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Button Text (Russian)",
        help_text="Text for CTA button",
    )
    button_text_az = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Button Text (Azerbaijani)",
        help_text="Text for CTA button",
    )
    button_url = models.CharField(
        max_length=500,
        blank=True,
        verbose_name="Button URL",
        help_text="URL for CTA button (can be relative or absolute)",
    )

    # Display Settings
    order = models.PositiveIntegerField(
        default=0,
        db_index=True,
        verbose_name="Display Order",
        help_text="Order in which section appears",
    )
    is_featured = models.BooleanField(
        default=False,
        db_index=True,
        verbose_name="Featured",
        help_text="Show on homepage",
    )

    def __str__(self):
        return f"{self.get_section_type_display()}: {self.title_en}"

    class Meta:
        verbose_name = "Promo Section"
        verbose_name_plural = "Promo Sections"
        ordering = ("order", "-created_at")
        indexes = [
            models.Index(fields=["section_type", "is_active"]),
            models.Index(fields=["is_featured", "order"]),
        ]
