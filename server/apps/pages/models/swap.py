from django.db import models
from ckeditor.fields import RichTextField
from django.core.validators import FileExtensionValidator
from imagekit.models import ProcessedImageField
from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin
from ..utils import upload_to


class Swap(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "title_en"

    label_az = models.CharField(
        max_length=50,
        blank=False,
        null=False,
        verbose_name="Label-(Az)",
    )
    label_ru = models.CharField(
        max_length=50,
        blank=False,
        null=False,
        verbose_name="Label-(Ru)",
    )
    label_en = models.CharField(
        max_length=50,
        blank=False,
        null=False,
        verbose_name="Label-(En)",
    )
    title_az = models.CharField(
        max_length=150,
        blank=False,
        null=False,
        verbose_name="Title-(Az)",
        help_text="Title of the swap event.",
    )
    title_ru = models.CharField(
        max_length=150,
        blank=False,
        null=False,
        verbose_name="Title-(Ru)",
        help_text="Title of the swap event.",
    )
    title_en = models.CharField(
        max_length=150,
        blank=False,
        null=False,
        verbose_name="Title-(En)",
        help_text="Title of the swap event.",
    )
    content_az = RichTextField(
        blank=False,
        null=False,
        verbose_name="Content-(Az)",
        help_text="Optional description or additional text.",
    )
    content_ru = RichTextField(
        blank=False,
        null=False,
        verbose_name="Content-(Ru)",
        help_text="Optional description or additional text.",
    )
    content_en = RichTextField(
        blank=False,
        null=False,
        verbose_name="Content-(En)",
        help_text="Optional description or additional text.",
    )
    poster = ProcessedImageField(
        upload_to=upload_to("swaps/posters/%Y/%m/%d/"),
        validators=[
            FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "webp", "png"])
        ],
        options={"quality": 85},
        format="WEBP",
        blank=True,
        null=True,
        verbose_name="Poster Images",
        help_text="Upload a poster images.",
    )

    def __str__(self):
        return self.title_en

    class Meta:
        verbose_name = "Swap"
        verbose_name_plural = "Swaps"
        ordering = ("-created_at",)
