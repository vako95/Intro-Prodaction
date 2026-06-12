from django.db import models
from django.contrib.auth.models import AbstractUser

from ..managers import UserManager
import uuid
import os


def upload_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    return os.path.join("users", "avatars", instance.username, uuid.uuid4().hex + ext)


class GENDER(models.TextChoices):
    MALE = "male", "Male"
    FEMALE = "female", "Female"
    OTHER = "other", "Other"


class User(AbstractUser):
    objects = UserManager()

    gender = models.CharField(
        max_length=10,
        choices=GENDER.choices,
        default=GENDER.OTHER,
        verbose_name="Choice",
    )
    avatar = models.ImageField(
        upload_to=upload_path,
        blank=True,
        null=True,
        verbose_name="Avatar",
        help_text="Upload a profile picture (optional). Recommended size: 256x256px.",
    )

    is_email_verified = models.BooleanField(default=False)

    date_of_birth = models.DateField(
        blank=True,
        null=True,
        verbose_name="Date of Birth",
        help_text="Select your birth date. Format: YYYY-MM-DD",
    )

    # Contact Information
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name="Phone Number",
        help_text="Contact phone number with country code (e.g., +1234567890)",
    )

    # Address Information
    address = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Address",
        help_text="Street address or full address",
    )

    city = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="City",
        help_text="City of residence",
    )

    state = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="State/Province",
        help_text="State or province",
    )

    postal_code = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name="Postal Code",
        help_text="ZIP or postal code",
    )

    country = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Country",
        help_text="Country of residence",
    )

    # Additional Information
    nationality = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Nationality",
        help_text="Nationality or citizenship",
    )

    passport_number = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name="Passport Number",
        help_text="Passport or ID number for hotel bookings",
    )

    emergency_contact_name = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Emergency Contact Name",
        help_text="Name of emergency contact person",
    )

    emergency_contact_phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name="Emergency Contact Phone",
        help_text="Phone number of emergency contact",
    )

    # Preferences
    preferred_language = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        default="en",
        verbose_name="Preferred Language",
        help_text="Preferred language code (en, az, ru)",
    )

    receive_newsletter = models.BooleanField(
        default=True,
        verbose_name="Receive Newsletter",
        help_text="Subscribe to hotel newsletters and promotions",
    )

    receive_booking_notifications = models.BooleanField(
        default=True,
        verbose_name="Receive Booking Notifications",
        help_text="Receive notifications about bookings and reservations",
    )

    # Metadata
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At",
        help_text="Date and time when the account was created",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Updated At",
        help_text="Date and time when the profile was last updated",
    )

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
