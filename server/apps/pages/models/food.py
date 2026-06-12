from django.db import models
from django.core.validators import (
    FileExtensionValidator,
    MinValueValidator,
    MaxValueValidator,
)
from ckeditor.fields import RichTextField
from django.urls import reverse
from imagekit.models import ProcessedImageField
from .tag import Tag
from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin
from ..utils import upload_to


class Food(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "title_en"

    title_az = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        verbose_name="Title-(AZ)",
        help_text="Enter the name of the food item",
    )
    title_en = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        verbose_name="Title-(EN)",
        help_text="Enter the name of the food item",
    )
    title_ru = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        verbose_name="Title-(RU)",
        help_text="Enter the name of the food item",
    )
    subtitle_en = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        verbose_name="Subtitle-(EN)",
        help_text="Enter a subtitle or tagline for the food item (optional)",
    )
    subtitle_ru = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        verbose_name="Subtitle-(RU)",
        help_text="Enter a subtitle or tagline for the food item (optional)",
    )
    subtitle_az = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        verbose_name="Subtitle-(AZ)",
        help_text="Enter a subtitle or tagline for the food item (optional)",
    )
    description_en = RichTextField(
        blank=True,
        null=True,
        verbose_name="Description-(EN)",
        help_text="Enter a detailed description of the food item",
    )
    description_ru = RichTextField(
        blank=True,
        null=True,
        verbose_name="Description-(RU)",
        help_text="Enter a detailed description of the food item",
    )
    description_az = RichTextField(
        blank=True,
        null=True,
        verbose_name="Description-(AZ)",
        help_text="Enter a detailed description of the food item",
    )
    price = models.FloatField(
        blank=False,
        null=False,
        default=0.0,
        validators=[MinValueValidator(0), MaxValueValidator(1000000)],
        verbose_name="Price of the food",
        help_text="Enter the price of the food item (must be a positive number)",
    )
    tag = models.ManyToManyField(
        Tag,
        blank=True,
        related_name="foods",
        verbose_name="Tags",
        help_text="Select tags that are relevant to this food item",
    )
    poster = ProcessedImageField(
        upload_to=upload_to("food/%Y/%m/%d/"),
        validators=[
            FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png", "webp"])
        ],
        format="WEBP",
        options={"quality": 85},
        blank=True,
        null=True,
        verbose_name="Poster",
        help_text="Upload an image",
    )

    class Meta:
        verbose_name = "Food Item"
        verbose_name_plural = "Food Items"
        ordering = ("-created_at",)

    def __str__(self):
        return self.title_en
