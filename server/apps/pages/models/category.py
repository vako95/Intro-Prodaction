from django.db import models
from django.core.validators import FileExtensionValidator
from imagekit.models import ProcessedImageField

from .domain import Domain
from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin
from ..utils import upload_to


class Category(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "title_en"

    title_en = models.CharField(
        max_length=250,
        blank=False,
        null=False,
        verbose_name="Title of the category",
        help_text="Enter the name of the category item",
    )
    title_ru = models.CharField(
        max_length=250,
        blank=True,
        null=False,
        verbose_name="Title of the category (RU)",
        help_text="Enter the name of the category item in Russian",
    )
    title_az = models.CharField(
        max_length=250,
        blank=True,
        null=False,
        verbose_name="Title of the category (AZ)",
        help_text="Enter the name of the category item in Azerbaijani",
    )

    domain = models.ForeignKey(
        Domain,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="categories",
        verbose_name="Domain",
        help_text="Select the domain this category belongs to.",
    )

    poster = ProcessedImageField(
        upload_to=upload_to("categories/%Y/%m/%d/"),
        validators=[
            FileExtensionValidator(allowed_extensions=["png", "jpg", "jpeg"]),
        ],
        format="WEBP",
        options={"quality": 85},
        blank=True,
        null=True,
        verbose_name="Category Poster",
        help_text="Upload an image to represent the category.",
    )
    logo = ProcessedImageField(
        upload_to=upload_to(
            "brand/logos/%Y/%m/%d/",
            force_ext="webp",
        ),
        validators=[
            FileExtensionValidator(allowed_extensions=["png", "jpg", "jpeg"]),
        ],
        format="WEBP",
        options={"quality": 85},
        verbose_name="Brand Logo",
        help_text="Upload an image to represent the brand.",
    )

    def __str__(self):
        return self.title_en

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ("-created_at",)
