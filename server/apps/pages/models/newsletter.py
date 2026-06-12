from django.core.validators import EmailValidator
from django.db import models

from .base import BaseModel, TimeStampedModel


class Newsletter(BaseModel, TimeStampedModel):
    """Подписка на рассылку новостей"""

    email = models.EmailField(
        unique=True,
        db_index=True,
        validators=[EmailValidator()],
        verbose_name="Email Address",
        help_text="Subscriber email address",
    )
    subscribed_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Subscribed At",
        help_text="Date and time of subscription",
    )
    unsubscribed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Unsubscribed At",
        help_text="Date and time of unsubscription",
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name="IP Address",
        help_text="IP address of subscriber",
    )

    def __str__(self):
        status = "Active" if self.is_active else "Unsubscribed"
        return f"{self.email} ({status})"

    def unsubscribe(self):
        """Unsubscribe from newsletter"""
        from django.utils import timezone

        self.is_active = False
        self.unsubscribed_at = timezone.now()
        self.save(update_fields=["is_active", "unsubscribed_at"])

    class Meta:
        verbose_name = "Newsletter Subscription"
        verbose_name_plural = "Newsletter Subscriptions"
        ordering = ("-subscribed_at",)
        indexes = [
            models.Index(fields=["email", "is_active"]),
            models.Index(fields=["subscribed_at"]),
        ]
