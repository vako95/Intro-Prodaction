from django.core.validators import EmailValidator, MinLengthValidator
from django.db import models

from .base import BaseModel, TimeStampedModel


class InquiryStatus(models.TextChoices):
    NEW = "new", "New"
    IN_PROGRESS = "in_progress", "In Progress"
    RESOLVED = "resolved", "Resolved"
    CLOSED = "closed", "Closed"


class ContactInquiry(BaseModel, TimeStampedModel):
    """Обращения через форму обратной связи"""

    name = models.CharField(
        max_length=255,
        verbose_name="Full Name",
        help_text="Name of the person contacting",
    )
    email = models.EmailField(
        validators=[EmailValidator()],
        verbose_name="Email Address",
        help_text="Contact email address",
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Phone Number",
        help_text="Optional phone number",
    )
    subject = models.CharField(
        max_length=500,
        verbose_name="Subject",
        help_text="Subject of the inquiry",
    )
    message = models.TextField(
        validators=[MinLengthValidator(10)],
        verbose_name="Message",
        help_text="Detailed message (minimum 10 characters)",
    )
    status = models.CharField(
        max_length=20,
        choices=InquiryStatus.choices,
        default=InquiryStatus.NEW,
        db_index=True,
        verbose_name="Status",
        help_text="Current status of the inquiry",
    )
    resolved_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Resolved At",
        help_text="Date and time when inquiry was resolved",
    )
    admin_notes = models.TextField(
        blank=True,
        verbose_name="Admin Notes",
        help_text="Internal notes for staff",
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name="IP Address",
        help_text="IP address of sender",
    )

    def __str__(self):
        return f"{self.name} - {self.subject[:50]}"

    def mark_resolved(self):
        """Mark inquiry as resolved"""
        from django.utils import timezone

        self.status = InquiryStatus.RESOLVED
        self.resolved_at = timezone.now()
        self.save(update_fields=["status", "resolved_at"])

    class Meta:
        verbose_name = "Contact Inquiry"
        verbose_name_plural = "Contact Inquiries"
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["email"]),
        ]
