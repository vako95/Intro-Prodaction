from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import uuid
from django.conf import settings


User = get_user_model()


class PasswordResetToken(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="password_reset_tokens"
    )
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    is_used = models.BooleanField(default=False)

    def is_expired(self):
        time = settings.PASSWORD_RESET_MIN
        if time is None:
            return False
        return timezone.now() > self.created_at + timedelta(minutes=time)

    def mark_used(self):
        if self.is_used:
            return
        self.is_used = True
        self.save(update_fields=["is_used"])
