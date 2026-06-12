from django.db import models
from django.core.validators import FileExtensionValidator
from ckeditor.fields import RichTextField
from imagekit.models import ProcessedImageField
from django.core.exceptions import ValidationError
from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin
from ..utils import SVGValidator, upload_to


class Service(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "title_en"

    card_icon = models.FileField(
        upload_to="service/card/%Y/%m/%d/",
        validators=[
            FileExtensionValidator(
                allowed_extensions=["svg", "png"],
            ),
            SVGValidator(),
        ],
        verbose_name="icon svg",
        help_text="Add to card only icon svg please!",
    )
    title_az = models.CharField(
        max_length=255,
        verbose_name="title azerbaijani",
        help_text="Title for azerbaijani language",
    )
    title_ru = models.CharField(
        max_length=255,
        verbose_name="title russian",
        help_text="Title for russian language",
    )
    title_en = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        verbose_name="title english",
        help_text="Title for english language",
    )
    description_en = models.TextField(
        blank=True,
        null=True,
        verbose_name="Description-(En)",
        help_text="Short description for the service",
    )
    description_ru = models.TextField(
        blank=True,
        null=True,
        verbose_name="Description-(Ru)",
        help_text="Short description for the service",
    )
    description_az = models.TextField(
        blank=True,
        null=True,
        verbose_name="Description-(Az)",
        help_text="Short description for the service",
    )
    cover_img = ProcessedImageField(
        upload_to=upload_to("services/%Y/%m/%d/"),
        validators=[
            FileExtensionValidator(["png", "jpg", "jpeg", "webp"]),
        ],
        options={"quality": 85},
        format="WEBP",
        blank=True,
        null=True,
        verbose_name="Cover image",
        help_text="Upload a cover image for the service",
    )
    card_image = ProcessedImageField(
        upload_to=upload_to("services/card_images/%Y/%m/%d/"),
        validators=[
            FileExtensionValidator(allowed_extensions=["png", "jpg", "jpeg", "webp"]),
        ],
        options={"quality": 85},
        format="WEBP",
        blank=True,
        null=True,
        verbose_name="Card image",
        help_text="Upload an image for the service card",
    )

    def __str__(self):
        return self.title_en


class ServiceFeature(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "title_en"

    service = models.OneToOneField(
        Service,
        on_delete=models.CASCADE,
        related_name="feature",
        verbose_name="Service Feature",
        help_text="Feature section for the service",
    )
    subtitle_az = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Subtitle-(Az)",
        help_text="Subtitle for the feature section",
    )
    subtitle_ru = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Subtitle-(Ru)",
        help_text="Subtitle for the feature section",
    )
    subtitle_en = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Subtitle-(En)",
        help_text="Subtitle for the feature section",
    )
    title_en = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Title-(En)",
        help_text="Title for the feature section",
    )
    title_ru = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Title-(Ru)",
        help_text="Title for the feature section",
    )
    title_az = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Title-(Az)",
        help_text="Title for the feature section",
    )
    # short_content_az = RichTextField(
    #     blank=True,
    #     null=True,
    #     config_name="default",
    #     verbose_name="Short Content-(Az)",
    #     help_text="Short content for the service feature",
    # )
    # short_content_ru = RichTextField(
    #     blank=True,
    #     null=True,
    #     config_name="default",
    #     verbose_name="Short Content-(Ru)",
    #     help_text="Short content for the service feature",
    # )
    # short_content_en = RichTextField(
    #     blank=True,
    #     null=True,
    #     config_name="default",
    #     verbose_name="Short Content-(En)",
    #     help_text="Short content for the service feature",
    # )
    content_az = RichTextField(
        blank=True,
        null=True,
        config_name="default",
        verbose_name="Content-(Az)",
        help_text="Detailed content for the service feature",
    )
    content_ru = RichTextField(
        blank=True,
        null=True,
        config_name="default",
        verbose_name="Content-(Ru)",
        help_text="Detailed content for the service feature",
    )
    content_en = RichTextField(
        blank=True,
        null=True,
        config_name="default",
        verbose_name="Content-(En)",
        help_text="Detailed content for the service feature",
    )

    def __str__(self):
        return f"Feature: {self.title_en}"


class ServiceFeatureItem(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "title_en"

    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name="feature_items",
        verbose_name="Service Feature Item",
    )
    icon = models.FileField(
        validators=[
            FileExtensionValidator(
                allowed_extensions=["svg", "png"],
            ),
            SVGValidator(),
        ],
        upload_to=upload_to("services/feature/%Y/%m/%d/"),
        blank=True,
        null=True,
        verbose_name="Item Icon",
    )
    title_az = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        verbose_name="Title-(Az)",
        help_text="Service items title",
    )
    title_ru = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        verbose_name="Title-(Ru)",
        help_text="Service items title",
    )
    title_en = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        verbose_name="Title-(En)",
        help_text="Service items title",
    )

    def clean(self):
        super().clean()
        if self.service_id:
            existing_count = (
                ServiceFeatureItem.objects.filter(service=self.service)
                .exclude(pk=self.pk)
                .count()
            )

            if existing_count >= 2:
                raise ValidationError("Maximum 2 feature items allowed per service.'")

    def __str__(self):
        return f"{self.title_en}"


def validate_video_size(file):
    if file.size > 50 * 1024 * 1024:
        raise ValidationError("Video file size must be under 50MB.")


class ServiceVideo(BaseModel, TimeStampedModel):

    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name="videos",
        verbose_name="Service Video",
    )
    video_url = models.URLField(
        blank=True,
        null=True,
        verbose_name="Video URL",
    )
    video_file = models.FileField(
        upload_to="services/video_files/%Y/%m/%d/",
        validators=[
            FileExtensionValidator(["mp4", "mov", "avi", "mkv"]),
            validate_video_size,
        ],
        blank=True,
        null=True,
        verbose_name="Video File",
    )

    def __str__(self):
        return f"Video for {self.service.title_en}"
