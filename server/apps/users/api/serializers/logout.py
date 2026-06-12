# from django.forms import ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(required=False)

    def validate(self, attrs):
        request = self.context.get("request")
        raw_refresh = attrs.get("refresh")

        if not raw_refresh and request:
            raw_refresh = request.COOKIES.get("refresh")

        if not raw_refresh:
            raise ValidationError(
                detail="Refresh token is missing !",
                code="REFRESH_REQUIRED",
            )

        try:
            self._refresh_token = RefreshToken(raw_refresh)

        except TokenError:
            raise serializers.ValidationError(
                {
                    "code": "INVALID_OR_BLACKLISTED_TOKEN",
                    "message": "Refresh token is invalid or expired!",
                }
            )

        return attrs

    def save(self, **kwargs):
        if hasattr(self._refresh_token, "blacklist"):
            self._refresh_token.blacklist()
