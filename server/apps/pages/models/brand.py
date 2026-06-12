from django.db import models
from django.core.validators import FileExtensionValidator

from apps.pages.utils.validators import SVGValidator
from .base import BaseModel, TimeStampedModel

from imagekit.models import ProcessedImageField
from ..utils import SVGValidator, upload_to
from .mixins import SlugMixin


class Brand(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "name_en"

    name_en = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        verbose_name="Brand (EN)",
        help_text="Enter the brand name (max 255 characters).",
    )
    name_az = models.CharField(
        max_length=255,
        blank=True,
        null=False,
        verbose_name="Brand (AZ)",
        help_text="Enter the brand name (max 255 characters).",
    )
    name_ru = models.CharField(
        max_length=255,
        blank=True,
        null=False,
        verbose_name="Brand (RU)",
        help_text="Enter the brand name (max 255 characters).",
    )
    logo = models.ImageField(
        upload_to=upload_to(
            "brand/logos/%Y/%m/%d/",
        ),
        validators=[
            FileExtensionValidator(allowed_extensions=["png", "jpg", "jpeg", "svg"]),
        ],
        # format="PNG",
        # options={"quality": 85},
        verbose_name="Brand Logo",
        help_text="Upload an image to represent the brand.",
    )
    logo_svg = models.FileField(
        upload_to="brand/logos/svg/%Y/%m/%d/",
        validators=[
            FileExtensionValidator(allowed_extensions=["svg"]),
            SVGValidator(),
        ],
        blank=True,
        null=True,
        verbose_name="Brand Logo (SVG)",
        help_text="Upload SVG logo.",
    )

    def __str__(self):
        return self.name_en

    class Meta:
        verbose_name = "Brand"
        verbose_name_plural = "Brands"
        ordering = ("-created_at",)
