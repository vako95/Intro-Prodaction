from rest_framework import serializers
from django.contrib.auth import get_user_model
from ...models import EmailPIN, Purpose, PasswordResetToken
import secrets
from django.conf import settings

from django.core.mail import send_mail
from django.template.loader import render_to_string

User = get_user_model()


class ResetPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, write_only=True)

    def validate_email(self, value):
        value = User.objects.normalize_email(value)
        return value

    def validate(self, attrs):
        email = attrs.get("email")
        user = User.objects.filter(email=email).first()
        attrs["resolved_user"] = user
        return attrs

    def create(self, validated_data):
        user = validated_data["resolved_user"]
        email = validated_data["email"]
        if user is not None:
            pin = f"{secrets.randbelow(10**6):06d}"
            pin_obj = EmailPIN.objects.create(
                user=user,
                email=email,
                purpose=Purpose.RESET_PASSWORD,
                pin=pin,
            )
            html_message = render_to_string(
                "users/emails/reset_password.html",
                {
                    "user": user,
                    "pin": pin_obj,
                },
            )

            send_mail(
                subject="Reset your password",
                message="Your password reset request",
                html_message=html_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

        return {"success": True}


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, write_only=True)
    pin = serializers.CharField(required=True, write_only=True)
    purpose = serializers.ChoiceField(choices=Purpose.choices)

    def validate_email(self, value):
        value = User.objects.normalize_email(value)
        return value

    def validate(self, attrs):
        email = attrs.get("email")
        pin = attrs.get("pin")
        purpose = Purpose(attrs.get("purpose"))
        if purpose == Purpose.RESET_PASSWORD:
            pin_obj = EmailPIN.objects.filter(
                email=email,
                pin=pin,
                purpose=purpose,
                is_used=False,
            ).first()

            if not pin_obj:
                raise serializers.ValidationError({"pin": "Invalid PIN or email."})
            if pin_obj.is_expired():
                raise serializers.ValidationError({"pin": "PIN has expired."})

        attrs["resolved_pin"] = pin_obj
        return attrs

    def create(self, validated_data):
        email = validated_data["email"]
        pin_obj = validated_data["resolved_pin"]
        pin_obj.mark_used()
        user = User.objects.filter(email=email).first()

        token_obj = PasswordResetToken.objects.create(
            user=user,
        )
        return {"token_obj": token_obj}


class PasswordResetChangeSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, write_only=True)
    token = serializers.UUIDField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)

    def validate_email(self, value):
        value = User.objects.normalize_email(value)
        return value

    def validate(self, attrs):
        email = attrs.get("email")
        token = attrs.get("token")
        user = User.objects.filter(email=email).first()

        if user is not None:
            try:
                token_obj = PasswordResetToken.objects.get(
                    user=user, token=token, is_used=False
                )
            except PasswordResetToken.DoesNotExist:
                raise serializers.ValidationError(
                    {"token": "Invalid token for the provided email."}
                )
            if token_obj.is_expired():
                raise serializers.ValidationError({"token": "Token has expired."})
        attrs["resolved_user"] = user
        attrs["resolved_token"] = token_obj
        return attrs

    def create(self, validated_data):
        user = validated_data["resolved_user"]
        token_obj = validated_data["resolved_token"]
        new_password = validated_data["new_password"]

        if user is not None:
            user.set_password(new_password)
            user.save()
            token_obj.mark_used()

        return {"success": True}
