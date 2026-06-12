from django.core.validators import FileExtensionValidator
from django.db import models
from imagekit.models import ProcessedImageField

from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin
from ..utils import upload_to


class GalleryCategory(BaseModel, TimeStampedModel, SlugMixin):
    """Категории для галереи отеля"""

    slug_source_field = "name_en"

    name_en = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Category Name (English)",
        help_text="e.g., Exterior, Interior, Restaurant, Pool, Spa",
    )
    name_ru = models.CharField(
        max_length=100,
        verbose_name="Category Name (Russian)",
        help_text="Category name in Russian",
    )
    name_az = models.CharField(
        max_length=100,
        verbose_name="Category Name (Azerbaijani)",
        help_text="Category name in Azerbaijani",
    )
    description_en = models.TextField(
        blank=True,
        verbose_name="Description (English)",
        help_text="Optional description of the category",
    )
    description_ru = models.TextField(
        blank=True,
        verbose_name="Description (Russian)",
        help_text="Optional description of the category",
    )
    description_az = models.TextField(
        blank=True,
        verbose_name="Description (Azerbaijani)",
        help_text="Optional description of the category",
    )
    order = models.PositiveIntegerField(
        default=0,
        db_index=True,
        verbose_name="Display Order",
        help_text="Order in which category appears",
    )

    def __str__(self):
        return self.name_en

    class Meta:
        verbose_name = "Gallery Category"
        verbose_name_plural = "Gallery Categories"
        ordering = ("order", "name_en")


class HotelGallery(BaseModel, TimeStampedModel):
    """Галерея фотографий отеля"""

    title_en = models.CharField(
        max_length=255,
        verbose_name="Title (English)",
        help_text="Photo title in English",
    )
    title_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Title (Russian)",
        help_text="Photo title in Russian",
    )
    title_az = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Title (Azerbaijani)",
        help_text="Photo title in Azerbaijani",
    )
    description_en = models.TextField(
        blank=True,
        verbose_name="Description (English)",
        help_text="Optional photo description",
    )
    description_ru = models.TextField(
        blank=True,
        verbose_name="Description (Russian)",
        help_text="Optional photo description",
    )
    description_az = models.TextField(
        blank=True,
        verbose_name="Description (Azerbaijani)",
        help_text="Optional photo description",
    )
    image = ProcessedImageField(
        upload_to=upload_to("gallery/%Y/%m/%d/"),
        validators=[
            FileExtensionValidator(
                allowed_extensions=["jpg", "jpeg", "png", "webp"]
            )
        ],
        format="WEBP",
        options={"quality": 90},
        verbose_name="Image",
        help_text="Upload hotel photo (high quality recommended)",
    )
    thumbnail = ProcessedImageField(
        upload_to=upload_to("gallery/thumbnails/%Y/%m/%d/"),
        validators=[
            FileExtensionValidator(
                allowed_extensions=["jpg", "jpeg", "png", "webp"]
            )
        ],
        format="WEBP",
        options={"quality": 70},
        blank=True,
        null=True,
        verbose_name="Thumbnail",
        help_text="Optional thumbnail (auto-generated if empty)",
    )
    category = models.ForeignKey(
        GalleryCategory,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name="Category",
        help_text="Select gallery category",
    )
    order = models.PositiveIntegerField(
        default=0,
        db_index=True,
        verbose_name="Display Order",
        help_text="Order in which photo appears in gallery",
    )
    is_featured = models.BooleanField(
        default=False,
        db_index=True,
        verbose_name="Featured",
        help_text="Show on homepage or featured section",
    )

    def __str__(self):
        return f"{self.category.name_en}: {self.title_en}"

    class Meta:
        verbose_name = "Hotel Gallery Image"
        verbose_name_plural = "Hotel Gallery Images"
        ordering = ("category", "order", "-created_at")
        indexes = [
            models.Index(fields=["category", "order"]),
            models.Index(fields=["is_active", "is_featured"]),
        ]
