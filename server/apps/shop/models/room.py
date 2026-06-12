from ckeditor.fields import RichTextField
from django.core.validators import (
    FileExtensionValidator,
    MaxValueValidator,
    MinValueValidator,
)
from django.db import models

from core.constants import ICON_CHOICES

from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin


class Room(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "title_en"

    IMAGE_EXTENSIONS = ["jpg", "jpeg", "webp", "png"]
    MAX_PRICE = 10_000_000

    title_az = models.CharField(
        max_length=255,
        db_index=True,
        verbose_name="Azerbaijani title",
        help_text="Enter the title of the room item",
    )
    title_en = models.CharField(
        max_length=255,
        db_index=True,
        verbose_name="English title",
        help_text="Enter the title of the room item",
    )
    title_ru = models.CharField(
        max_length=255,
        db_index=True,
        verbose_name="Russian title",
        help_text="Enter the title of the room item",
    )
    subtitle_az = models.CharField(
        max_length=255,
        verbose_name="Azerbaijani subtitle",
        help_text="Enter the subtitle of the room item",
    )
    subtitle_en = models.CharField(
        max_length=255,
        verbose_name="English subtitle",
        help_text="Enter the subtitle of the room item",
    )
    subtitle_ru = models.CharField(
        max_length=255,
        verbose_name="Russian subtitle",
        help_text="Enter the subtitle of the room item",
    )
    excerpt_az = models.TextField(
        verbose_name="Azerbaijani excerpt",
    )
    excerpt_en = models.TextField(
        verbose_name="English excerpt",
    )
    excerpt_ru = models.TextField(
        verbose_name="Russian excerpt",
    )
    description_az = RichTextField(
        verbose_name="Azerbaijani description",
    )
    description_en = RichTextField(
        verbose_name="English description",
    )
    description_ru = RichTextField(
        verbose_name="Russian description",
    )
    poster = models.FileField(
        upload_to="room/%Y/%d/%m/",
        validators=[FileExtensionValidator(allowed_extensions=IMAGE_EXTENSIONS)],
        blank=True,
        null=True,
        verbose_name="Poster",
        help_text="Upload an image",
    )
    capacity_adult = models.PositiveSmallIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name="Adults capacity",
        help_text="Maximum number of adults allowed (0–10).",
    )
    capacity_children = models.PositiveSmallIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        verbose_name="Child capacity",
        help_text="Maximum number of childs allowed (0–10).",
    )
    room_count = models.PositiveSmallIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name="Number of Rooms",
        help_text="Total number of rooms of this type available in the hotel",
    )
    size = models.PositiveSmallIntegerField(
        default=30,
        validators=[MinValueValidator(1)],
        verbose_name="Room Size (m²)",
        help_text="Room size in square meters",
    )
    beds = models.PositiveSmallIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name="Number of Beds",
        help_text="Number of beds in the room",
    )
    view_az = models.CharField(
        max_length=100,
        blank=True,
        default="",
        verbose_name="Azerbaijani View",
        help_text="View from the room (e.g., Sea View, City View)",
    )
    view_en = models.CharField(
        max_length=100,
        blank=True,
        default="",
        verbose_name="English View",
        help_text="View from the room (e.g., Sea View, City View)",
    )
    view_ru = models.CharField(
        max_length=100,
        blank=True,
        default="",
        verbose_name="Russian View",
        help_text="View from the room (e.g., Sea View, City View)",
    )
    price = models.FloatField(
        default=0.0,
        db_index=True,
        validators=[MinValueValidator(0), MaxValueValidator(MAX_PRICE)],
        verbose_name="Price",
        help_text=f"Enter a value between 0 and {MAX_PRICE:,}.",
    )
    discount = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name="Discount percentage",
        help_text="Enter the discount as a percentage (0–10)",
    )

    def __str__(self):
        return self.title_en

    @property
    def capacity_total(self):
        return self.capacity_adult + self.capacity_children

    @property
    def final_price(self) -> int | float:
        discounted_price = self.price - (self.price * (self.discount / 100))
        price = float(f"{discounted_price:2g}")
        return int(price) if price.is_integer() else price

    class Meta:
        verbose_name = "Room"
        verbose_name_plural = "Rooms"
        ordering = ("-created_at",)


class RoomIcon(models.Model):
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="icons",
        verbose_name="Room",
    )
    key = models.CharField(
        max_length=50,
        choices=ICON_CHOICES,
        db_index=True,
        verbose_name="Icon key",
    )
    label = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name="Label",
    )

    def save(self, *args, **kwargs):
        if not self.label and self.key:
            label_map = dict(ICON_CHOICES)
            self.label = label_map.get(self.key, self.key.capitalize())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.room} - {self.key}"

    class Meta:
        verbose_name = "Room Icon"
        verbose_name_plural = "Room Icons"
        constraints = [
            models.UniqueConstraint(
                fields=["room", "key"],
                name="unique_room_icon",
            ),
        ]


class RoomImg(BaseModel, TimeStampedModel):
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name="Room",
        help_text="Select the room this image belongs to",
    )
    image = models.FileField(
        upload_to="room/%Y/%d/%m/",
        validators=[FileExtensionValidator(allowed_extensions=Room.IMAGE_EXTENSIONS)],
        verbose_name="Image",
        help_text="Upload an image for the room",
    )

    def __str__(self):
        return f"Image for {self.room.title_en}"

    class Meta:
        verbose_name = "Room Image"
        verbose_name_plural = "Room Images"
