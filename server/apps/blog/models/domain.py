from django.db import models

from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin


class Domain(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "name_en"

    name_az = models.CharField(
        max_length=150,
        unique=True,
        blank=False,
        null=False,
        verbose_name="Name-(Az)",
        help_text="Enter the unique name of the domain (max 150 characters).",
    )
    name_ru = models.CharField(
        max_length=150,
        unique=True,
        blank=False,
        null=False,
        verbose_name="Name-(Ru)",
        help_text="Enter the unique name of the domain (max 150 characters).",
    )
    name_en = models.CharField(
        max_length=150,
        unique=True,
        blank=False,
        null=False,
        verbose_name="Name-(En)",
        help_text="Enter the unique name of the domain (max 150 characters).",
    )

    def __str__(self):
        return self.name_en

    class Meta:
        verbose_name = "Domain"
        verbose_name_plural = "Domains"
        ordering = ("-created_at",)
