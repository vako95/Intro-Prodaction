from rest_framework import serializers
from django.contrib.auth.password_validation import (
    validate_password as django_validate_password,
)
from ..models import User, PasswordResetToken


class ResetPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return User.objects.normalize_email(value)


class ResetPasswordCompleteSerializer(serializers.Serializer):
    user = serializers.IntegerField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate_password(self, value):
        django_validate_password(value)
        return value

    def validate(self, attrs):
        user_id = attrs.get("user")
        token = attrs.get("token")

        reset_obj = PasswordResetToken.objects.filter(
            user_id=user_id,
            token=token,
            is_used=False,
        ).first()

        if not reset_obj:
            raise serializers.ValidationError("Token invalid or expired")
        try:
            reset_obj = PasswordResetToken.objects.filter(
                user_id=user_id, token=token, is_used=False
            ).first()
            if not reset_obj:
                raise serializers.ValidationError("Token invalid or expired")
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Token invalid or expired")

        attrs["reset_obj"] = reset_obj
        return attrs
