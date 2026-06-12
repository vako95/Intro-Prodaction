from django.core.validators import URLValidator
from django.db import models

from .base import BaseModel, TimeStampedModel


class PromotionalVideo(BaseModel, TimeStampedModel):
    title_az = models.CharField(
        max_length=255,
        verbose_name="Azerbaijani title",
        help_text="Enter the title for the promotional video",
    )
    title_en = models.CharField(
        max_length=255,
        verbose_name="English title",
        help_text="Enter the title for the promotional video",
    )
    title_ru = models.CharField(
        max_length=255,
        verbose_name="Russian title",
        help_text="Enter the title for the promotional video",
    )
    subtitle_az = models.CharField(
        max_length=255,
        verbose_name="Azerbaijani subtitle",
        help_text="Enter the subtitle for the promotional video",
    )
    subtitle_en = models.CharField(
        max_length=255,
        verbose_name="English subtitle",
        help_text="Enter the subtitle for the promotional video",
    )
    subtitle_ru = models.CharField(
        max_length=255,
        verbose_name="Russian subtitle",
        help_text="Enter the subtitle for the promotional video",
    )
    youtube_url = models.URLField(
        max_length=500,
        validators=[URLValidator()],
        verbose_name="YouTube URL",
        help_text="Enter the full YouTube video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)",
    )
    background_image = models.ImageField(
        upload_to="promotional_video/%Y/%m/%d/",
        blank=True,
        null=True,
        verbose_name="Background Image",
        help_text="Upload a background image for the video section",
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Is Active",
        help_text="Set to active to display this promotional video",
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Display Order",
        help_text="Order in which to display (lower numbers appear first)",
    )

    def __str__(self):
        return self.title_en

    @property
    def youtube_video_id(self):
        """Extract YouTube video ID from URL"""
        if not self.youtube_url:
            return None
        
        url = self.youtube_url
        
        # Handle different YouTube URL formats
        if "youtu.be/" in url:
            return url.split("youtu.be/")[1].split("?")[0]
        elif "youtube.com/watch?v=" in url:
            return url.split("v=")[1].split("&")[0]
        elif "youtube.com/embed/" in url:
            return url.split("embed/")[1].split("?")[0]
        
        return None

    class Meta:
        verbose_name = "Promotional Video"
        verbose_name_plural = "Promotional Videos"
        ordering = ("order", "-created_at")
