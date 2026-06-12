from django.contrib.auth.models import UserManager as BaseUserMananager


class UserManager(BaseUserMananager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_email_verified", True)
        return super().create_superuser(username, email, password, **extra_fields)
