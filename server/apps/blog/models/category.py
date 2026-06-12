from django.db import models
from django.core.validators import FileExtensionValidator
from .domain import Domain
from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin
from imagekit.models import ProcessedImageField
from ..utils import upload_to


class Category(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "title_en"

    title_az = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        verbose_name="Title-(Az)",
        help_text="Enter the name of the category item",
    )
    title_ru = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        verbose_name="Title-(Ru)",
        help_text="Enter the name of the category item",
    )
    title_en = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        verbose_name="Title-(En)",
        help_text="Enter the name of the category item",
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
        upload_to=upload_to("news/news/%Y/%m/%d/"),
        validators=[
            FileExtensionValidator(
                allowed_extensions=["jpg", "jpeg", "webp", "png"],
            )
        ],
        format="WEBP",
        options={"quality": 85},
        blank=True,
        null=True,
        verbose_name="Category Poster",
        help_text="Upload an image to represent the category.",
    )

    def __str__(self):
        return self.title_en

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ("-created_at",)
