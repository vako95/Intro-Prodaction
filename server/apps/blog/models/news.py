from django.db import models
from ckeditor.fields import RichTextField

from .tag import Tag
from .category import Category
from django.core.validators import FileExtensionValidator
from django.contrib.auth import get_user_model
from django.core.validators import (
    MinLengthValidator,
    MinValueValidator,
    MaxValueValidator,
)
from imagekit.models import ProcessedImageField
from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin
from ..utils import upload_to

User = get_user_model()


class News(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "title_en"

    title_az = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        verbose_name="Azerbaijani title",
        help_text="Enter the title of the news item",
    )
    title_ru = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        verbose_name="Russian title",
        help_text="Enter the title of the news item",
    )
    title_en = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        verbose_name="English title",
        help_text="Enter the title of the news item",
    )

    content_az = RichTextField(
        blank=True,
        null=True,
        verbose_name="Azerbaijani content",
        help_text="Enter the content of the news item",
    )
    content_ru = RichTextField(
        blank=True,
        null=True,
        verbose_name="Russian content",
        help_text="Enter the content of the news item",
    )
    content_en = RichTextField(
        blank=True,
        null=True,
        verbose_name="English content",
        help_text="Enter the content of the news item",
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="news",
        verbose_name="Author",
        help_text="The user who created the news item",
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
        verbose_name="News Poster",
        help_text="Upload an image for the news item",
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name="news",
        verbose_name="Category",
        help_text="Select a category for the news item",
    )
    tag = models.ManyToManyField(
        Tag,
        blank=True,
        related_name="news",
        verbose_name="Tag",
        help_text="Select a Tag for the product.",
    )

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(
                fields=[
                    "category",
                    "-created_at",
                ]
            ),
        ]

    def __str__(self):
        return self.title_en


class NewsComment(BaseModel, TimeStampedModel):
    news = models.ForeignKey(
        News,
        on_delete=models.CASCADE,
        related_name="comments",
        verbose_name="News",
        limit_choices_to={"is_active": True},
    )

    message = RichTextField(
        blank=False,
        null=False,
        validators=[MinLengthValidator(10)],
        verbose_name="Message",
    )

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="news_comments",
        verbose_name="Author",
    )

    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        related_name="replies",
        verbose_name="Parent Comment",
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["news", "-created_at"]),
            models.Index(fields=["parent", "-created_at"]),
        ]

    def __str__(self):
        return f"{self.author} - {self.news}: {self.message[:30]}"


class NewsCommentRating(BaseModel):

    RATING_CHOICES = [(i, f"{i} ⭐") for i in range(1, 6)]

    comment = models.ForeignKey(
        NewsComment,
        on_delete=models.CASCADE,
        related_name="ratings",
        verbose_name="News Comment",
    )

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="news_comment_ratings",
        verbose_name="Author",
    )

    rating = models.PositiveSmallIntegerField(
        choices=RATING_CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Rating",
        help_text="Select a rating between 1 and 5 stars",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["comment", "author"], name="unique_news_comment_author_rating"
            )
        ]

    def __str__(self):
        return f"{self.author.username} → {self.rating}"
