from django.db import models
from django.core.validators import FileExtensionValidator
from ckeditor.fields import RichTextField
from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin
from imagekit.models import ProcessedImageField
from ..utils import SVGValidator, upload_to


class AdvantagesBar(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "title_en"

    icon = ProcessedImageField(
        upload_to=upload_to(
            "advantages_bar/%Y/%m/%d",
            force_ext="webp",
        ),
        validators=[
            FileExtensionValidator(allowed_extensions=["png", "jpg", "jpeg"]),
        ],
        format="WEBP",
        options={"quality": 85},
        blank=True,
        null=True,
        verbose_name="Icon",
        help_text="Upload icon.",
    )
    logo_svg = models.FileField(
        upload_to="advantages_bar/svg/%Y/%m/%d/",
        validators=[
            FileExtensionValidator(allowed_extensions=["svg"]),
            SVGValidator(),
        ],
        blank=True,
        null=True,
        verbose_name="Advantages Bar Logo (SVG)",
        help_text="Upload SVG logo.",
    )
    title_en = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        verbose_name="Title (EN)",
        help_text="Enter the Advantages Bar title in English (optional).",
    )
    title_ru = models.CharField(
        max_length=255,
        blank=True,
        null=False,
        verbose_name="Title (RU)",
        help_text="Enter the Advantages Bar title in Russian (optional).",
    )
    title_az = models.CharField(
        max_length=255,
        blank=True,
        null=False,
        verbose_name="Title (AZ)",
        help_text="Enter the Advantages Bar title (main language).",
    )
    description_en = RichTextField(
        blank=True,
        null=False,
        verbose_name="Content (EN)",
        help_text="Optional content or descriptions",
    )
    description_ru = RichTextField(
        blank=True,
        null=False,
        verbose_name="Content (RU)",
        help_text="Optional content or descriptions",
    )
    description_az = RichTextField(
        blank=True,
        null=False,
        verbose_name="Description (AZ)",
        help_text="Optional description for the advantages bar.",
    )

    class Meta:
        verbose_name = "Advantages Bar"
        verbose_name_plural = "Advantages Bars"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title_en
