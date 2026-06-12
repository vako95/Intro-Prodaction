from typing import Any

from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.settings import api_settings
from rest_framework import serializers


User = get_user_model()


class RefreshSerializer(TokenRefreshSerializer):
    refresh = serializers.CharField(required=False)

    def validate(self, attrs: dict[str, Any]) -> dict[str, str]:
        request = self.context.get("request")
        raw_refresh = attrs.get("refresh")
        if not raw_refresh and request:
            raw_refresh = request.COOKIES.get("refresh")

        if not raw_refresh:
            raise serializers.ValidationError(
                detail="Refresh token is missing !",
                code="REFRESH_REQUIRED",
            )
        try:
            refresh = self.token_class(raw_refresh)
        except TokenError:
            raise serializers.ValidationError(
                detail="Refresh token is missing !",
                code="REFRESH_REQUIRED",
            )

        user_id = refresh.payload.get(api_settings.USER_ID_CLAIM)
        if user_id:
            try:
                user = User.objects.filter(
                    **{api_settings.USER_ID_FIELD: user_id}
                ).first()

            except User.DoesNotExist:
                raise AuthenticationFailed(
                    detail="User not found !",
                    code="USER_NOT_FOUND",
                )

        if not user or not api_settings.USER_AUTHENTICATION_RULE(user):
            raise AuthenticationFailed(
                self.error_messages["no_active_account"],
                "no_active_account",
            )

        data = {
            "access": str(refresh.access_token),
        }

        if api_settings.ROTATE_REFRESH_TOKENS:
            if api_settings.BLACKLIST_AFTER_ROTATION:
                try:
                    refresh.blacklist()
                except AttributeError:
                    pass

            refresh.set_jti()
            refresh.set_exp()
            refresh.set_iat()
            refresh.outstand()

            data["refresh"] = str(refresh)

        return data
