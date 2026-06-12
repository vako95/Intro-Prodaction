from django.db import models
from django.core.validators import (
    FileExtensionValidator,
    MinValueValidator,
    MaxValueValidator,
)
from .social import Social
from .base import BaseModel, TimeStampedModel
from .mixins import SlugMixin
from ..utils import upload_to
from imagekit.models import ProcessedImageField


class Personal(BaseModel, TimeStampedModel, SlugMixin):
    slug_source_field = "name_en"

    name_en = models.CharField(
        max_length=150,
        blank=False,
        null=False,
        verbose_name="Name-(En)",
        help_text="Enter the name of the person",
    )
    name_ru = models.CharField(
        max_length=150,
        blank=True,
        null=False,
        verbose_name="Name-(Ru)",
        help_text="Enter the name of the person",
    )
    name_az = models.CharField(
        max_length=150,
        blank=True,
        null=False,
        verbose_name="Name-(Az)",
        help_text="Enter the name of the person",
    )
    role_en = models.CharField(
        max_length=150,
        blank=False,
        null=False,
        verbose_name="Role-(En)",
        help_text="Enter the role of the person",
    )
    role_ru = models.CharField(
        max_length=150,
        blank=True,
        null=False,
        verbose_name="Role-(Ru)",
        help_text="Enter the role of the person",
    )
    role_az = models.CharField(
        max_length=150,
        blank=True,
        null=False,
        verbose_name="Role-(Az)",
        help_text="Enter the role of the person",
    )

    social = models.ManyToManyField(
        Social,
        through='PersonalSocialLink',
        blank=True,
        verbose_name="Social Media",
        help_text="Select social media profiles associated with the person.",
    )

    poster = ProcessedImageField(
        upload_to=upload_to("personal/%Y/%m/%d/"),
        validators=[
            FileExtensionValidator(
                allowed_extensions=["jpg", "jpeg", "webp", "png"],
            )
        ],
        format="WEBP",
        options={"quality": 85},
        blank=True,
        null=True,
        verbose_name="Personal Image",
        help_text="Upload an image for the person.",
    )

    bio_en = models.TextField(
        blank=True,
        verbose_name="Biography (En)",
        help_text="Enter the biography of the person",
    )
    bio_ru = models.TextField(
        blank=True,
        verbose_name="Biography (Ru)",
        help_text="Enter the biography of the person",
    )
    bio_az = models.TextField(
        blank=True,
        verbose_name="Biography (Az)",
        help_text="Enter the biography of the person",
    )

    email = models.EmailField(
        blank=True,
        verbose_name="Email",
        help_text="Enter the email address",
    )

    phone = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Phone",
        help_text="Enter the phone number",
    )

    age = models.PositiveIntegerField(
        blank=True,
        null=True,
        verbose_name="Age",
        help_text="Enter the age",
    )

    website = models.URLField(
        blank=True,
        verbose_name="Website",
        help_text="Enter the website URL",
    )

    address = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Address",
        help_text="Enter the address",
    )

    blood_group = models.CharField(
        max_length=10,
        blank=True,
        verbose_name="Blood Group",
        help_text="Enter the blood group (e.g., A+, B-, O+, AB+)",
    )

    class Meta:
        verbose_name = "Personal"
        verbose_name_plural = "Personal"
        ordering = ("-created_at",)


class PersonalSkill(BaseModel, TimeStampedModel):
    personal = models.ForeignKey(
        Personal,
        on_delete=models.CASCADE,
        related_name="skills",
        verbose_name="Personal",
        help_text="Select the person this skill belongs to",
    )

    name_en = models.CharField(
        max_length=100,
        verbose_name="Skill Name (En)",
        help_text="Enter the skill name in English",
    )
    name_ru = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Skill Name (Ru)",
        help_text="Enter the skill name in Russian",
    )
    name_az = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Skill Name (Az)",
        help_text="Enter the skill name in Azerbaijani",
    )

    value = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name="Skill Level (%)",
        help_text="Enter the skill level as a percentage (0-100)",
    )

    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Order",
        help_text="Order of the skill in the list",
    )

    class Meta:
        verbose_name = "Personal Skill"
        verbose_name_plural = "Personal Skills"
        ordering = ("order", "id")

    def __str__(self):
        return f"{self.name_en} - {self.value}%"


class PersonalSocialLink(BaseModel, TimeStampedModel):
    """Through model for Personal-Social relationship with custom URL"""
    personal = models.ForeignKey(
        Personal,
        on_delete=models.CASCADE,
        related_name="social_links",
        verbose_name="Personal",
    )
    social = models.ForeignKey(
        Social,
        on_delete=models.CASCADE,
        verbose_name="Social Platform",
        help_text="Select the social media platform",
    )
    url = models.URLField(
        max_length=250,
        verbose_name="Personal URL",
        help_text="Enter your personal URL for this social platform",
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Order",
        help_text="Display order",
    )

    class Meta:
        verbose_name = "Personal Social Link"
        verbose_name_plural = "Personal Social Links"
        ordering = ("order", "id")
        constraints = [
            models.UniqueConstraint(
                fields=["personal", "social"],
                name="unique_personal_social_link",
            )
        ]

    def __str__(self):
        return f"{self.personal.name_en} - {self.social.title_en}"
