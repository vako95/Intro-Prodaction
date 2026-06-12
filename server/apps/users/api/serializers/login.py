from asyncio import exceptions
from typing import Any
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import exceptions, serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

User = get_user_model()


class LoginSerializer(TokenObtainPairSerializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs: dict[str, Any]) -> dict[Any, Any]:
        username = attrs.get('username', '').strip()
        email = attrs.get('email', '').strip()
        password = attrs.get('password', '')

        # Check if either username or email is provided
        if not username and not email:
            raise serializers.ValidationError(
                "Either username or email must be provided."
            )

        # Try to authenticate with username first
        user = None
        if username:
            user = authenticate(username=username, password=password, request=self.context.get("request"))
        
        # If not found, try with email
        if not user and email:
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password, request=self.context.get("request"))
            except User.DoesNotExist:
                pass

        if not user:
            raise exceptions.AuthenticationFailed(
                code="no_active_account",
                detail="No active account found with the given credentials",
            )
        
        if not user.is_active:
            raise AuthenticationFailed("User is inactive!")

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return {
            "refresh": str(refresh),
            "access": str(access),
        }
