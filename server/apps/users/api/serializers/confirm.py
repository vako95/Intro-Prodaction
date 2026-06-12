from rest_framework import serializers
from ...models import EmailPIN, Purpose
from django.contrib.auth import get_user_model
import secrets
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings

User = get_user_model()


class EmailSendSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        value = User.objects.normalize_email(value)
        return value

    def validate(self, attrs):
        email = attrs.get("email")
        user = User.objects.filter(email=email).first()
        attrs["resolved_user"] = user
        attrs["is_new_registration"] = user is None
        return attrs

    def create(self, validated_data):
        user = validated_data["resolved_user"]
        email = validated_data["email"]
        is_new_registration = validated_data.get("is_new_registration", False)
        
        if is_new_registration:
            temp_username = f"temp_{email.split('@')[0]}_{secrets.token_hex(4)}"
            user = User.objects.create_user(
                username=temp_username,
                email=email,
                is_active=False
            )
        
        pin = f"{secrets.randbelow(10**6):06d}"
        pin_obj = EmailPIN.objects.create(
            user=user,
            email=email,
            purpose=Purpose.REGISTER,
            pin=pin,
        )
        
        html_message = render_to_string(
            "users/emails/email_confirm.html",
            {
                "user": user,
                "pin": pin_obj,
            },
        )
        
        send_mail(
            subject="Confirm your email",
            message=f"Your verification code is: {pin}",
            html_message=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        
        return pin_obj


class EmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, write_only=True)
    pin = serializers.CharField(required=True, write_only=True)

    def validate_email(self, value):
        value = User.objects.normalize_email(value)
        return value

    def validate(self, attrs):
        email = attrs.get("email")
        pin = attrs.get("pin")
        user = User.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError("Invalid or expired PIN.")

        pin_obj = EmailPIN.objects.filter(
            user=user,
            email=email,
            purpose=Purpose.REGISTER,
            pin=pin,
            is_used=False,
        ).first()

        if not pin_obj or pin_obj.is_expired():
            raise serializers.ValidationError("Invalid or expired PIN.")

        attrs["resolved_user"] = user
        attrs["pin_obj"] = pin_obj
        return attrs

    def save(self, **kwargs):
        user = self.validated_data["resolved_user"]
        pin_obj = self.validated_data["pin_obj"]

        if not user.is_email_verified:
            user.is_email_verified = True
            user.save(update_fields=["is_email_verified"])
        pin_obj.mark_used()

        return user
