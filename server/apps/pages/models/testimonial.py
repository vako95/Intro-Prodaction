from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.shop.models.base import BaseModel, TimeStampedModel


class Testimonial(BaseModel, TimeStampedModel):
    IMAGE_EXTENSIONS = ["jpg", "jpeg", "webp", "png"]

    name_az = models.CharField(
        max_length=255,
        verbose_name="Azerbaijani name",
        help_text="Enter the customer name",
    )
    name_en = models.CharField(
        max_length=255,
        verbose_name="English name",
        help_text="Enter the customer name",
    )
    name_ru = models.CharField(
        max_length=255,
        verbose_name="Russian name",
        help_text="Enter the customer name",
    )
    role_az = models.CharField(
        max_length=255,
        verbose_name="Azerbaijani role",
        help_text="Enter the customer role (e.g., Guest Review, Client Review)",
    )
    role_en = models.CharField(
        max_length=255,
        verbose_name="English role",
        help_text="Enter the customer role (e.g., Guest Review, Client Review)",
    )
    role_ru = models.CharField(
        max_length=255,
        verbose_name="Russian role",
        help_text="Enter the customer role (e.g., Guest Review, Client Review)",
    )
    comment_az = models.TextField(
        verbose_name="Azerbaijani comment",
        help_text="Enter the testimonial comment",
    )
    comment_en = models.TextField(
        verbose_name="English comment",
        help_text="Enter the testimonial comment",
    )
    comment_ru = models.TextField(
        verbose_name="Russian comment",
        help_text="Enter the testimonial comment",
    )
    image = models.ImageField(
        upload_to="testimonials/%Y/%m/%d/",
        verbose_name="Customer Image",
        help_text="Upload customer photo",
    )
    rating = models.FloatField(
        default=5.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(5.0)],
        verbose_name="Rating",
        help_text="Rating from 0 to 5",
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Is Active",
        help_text="Set to active to display this testimonial",
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Display Order",
        help_text="Order in which to display (lower numbers appear first)",
    )

    def __str__(self):
        return self.name_en

    class Meta:
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"
        ordering = ("order", "-created_at")
