from django.db import models
from core.constants import ICON_CHOICES
from .mixins import SlugMixin
from .base import BaseModel, TimeStampedModel


class Social(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "title_en"

    title_az = models.CharField(
        max_length=150,
        blank=False,
        null=False,
        verbose_name="Title-(Az)",
        help_text="Enter the title of the social media platform",
    )
    title_ru = models.CharField(
        max_length=150,
        blank=False,
        null=False,
        verbose_name="Title-(Ru)",
        help_text="Enter the title of the social media platform",
    )
    title_en = models.CharField(
        max_length=150,
        blank=False,
        null=False,
        verbose_name="Title-(En)",
        help_text="Enter the title of the social media platform",
    )

    icon = models.CharField(
        max_length=150,
        choices=ICON_CHOICES,
        blank=True,
        null=True,
        verbose_name="Icon",
        help_text="Select an icon representing the social media platform.",
    )

    def __str__(self):
        return self.title_en

    class Meta:
        verbose_name = "Social"
        verbose_name_plural = "Socials"
        ordering = ("-created_at",)
