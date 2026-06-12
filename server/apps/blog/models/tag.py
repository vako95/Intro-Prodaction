from django.db import models
from django.urls import reverse

from imagekit.models import ProcessedImageField
from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin


class Tag(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "name_en"

    name_az = models.CharField(
        max_length=255,
        unique=True,
        null=False,
        blank=False,
        verbose_name="Name-(Az)",
        help_text="Enter the name of the tag (max 255 characters).",
    )
    name_ru = models.CharField(
        max_length=255,
        unique=True,
        null=False,
        blank=False,
        verbose_name="Name-(Ru)",
        help_text="Enter the name of the tag (max 255 characters).",
    )
    name_en = models.CharField(
        max_length=255,
        unique=True,
        null=False,
        blank=False,
        verbose_name="Name-(En)",
        help_text="Enter the name of the tag (max 255 characters).",
    )

    def __str__(self):
        return self.name_en

    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"
        ordering = ("-created_at",)
