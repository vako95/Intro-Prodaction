from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from django.conf import settings

User = get_user_model()


class Purpose(models.TextChoices):
    REGISTER = "register", "Register"
    RESET_PASSWORD = "reset_password", "Reset Password"
    CHANGE_EMAIL = "change_email", "Change Email"


class EmailPIN(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="email_pins")
    purpose = models.CharField(
        max_length=32,
        blank=False,
        null=False,
        choices=Purpose.choices,
    )
    email = models.EmailField()
    pin = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.email} - {self.pin}"

    def is_expired(self):
        time = settings.EMAIL_PIN_MIN.get(self.purpose, None)
        if time is None:
            return False
        return timezone.now() > self.created_at + timedelta(minutes=time)

    def mark_used(self):
        if self.is_used:
            return
        self.is_used = True
        self.save(update_fields=["is_used"])
