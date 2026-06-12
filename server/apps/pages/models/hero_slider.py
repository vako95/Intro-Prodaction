from django.db import models

from ckeditor_uploader.fields import RichTextUploadingField
from django.core.validators import FileExtensionValidator
from imagekit.models import ProcessedImageField
from ..models.brand import Brand
from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin
from ..utils import upload_to


class HeroSlider(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "title_en"

    title_en = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        verbose_name="Title-(EN)",
        help_text="Title displayed on the hero slider.",
    )
    title_ru = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        verbose_name="Title-(RU)",
        help_text="Title displayed on the hero slider.",
    )
    title_az = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        verbose_name="Title-(AZ)",
        help_text="Title displayed on the hero slider.",
    )

    subtitle_az = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Subtitle (AZ)",
        help_text="Subtitle displayed on the hero slider.",
    )
    subtitle_ru = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Subtitle-(RU)",
        help_text="Subtitle displayed on the hero slider.",
    )
    subtitle_en = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Subtitle-(EN)",
        help_text="Subtitle displayed on the hero slider.",
    )

    description_en = RichTextUploadingField(
        blank=True,
        null=True,
        verbose_name="Description-(EN)",
        help_text="Detailed description for the hero slider.",
    )
    description_ru = RichTextUploadingField(
        blank=True,
        null=True,
        verbose_name="Description-(RU)",
        help_text="Detailed description for the hero slider.",
    )
    description_az = RichTextUploadingField(
        blank=True,
        null=True,
        verbose_name="Description-(AZ)",
        help_text="Detailed description for the hero slider.",
    )

    brand = models.ForeignKey(
        Brand,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="hero_sliders",
        verbose_name="Brand",
        help_text="Brand connected with the slider.",
    )

    poster = ProcessedImageField(
        upload_to=upload_to("hero_slider/%Y/%m/%d/"),
        validators=[
            FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "webp", "png"])
        ],
        format="WEBP",
        options={"quality": 85},
        blank=True,
        null=True,
        verbose_name="Slider Image",
        help_text="Upload an image for the hero slider.",
    )

    def __str__(self):
        return self.title_en

    class Meta:
        verbose_name = "Hero Slider"
        verbose_name_plural = "Hero Sliders"
        ordering = ("-created_at",)
