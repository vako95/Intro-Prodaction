from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.password_validation import (
    validate_password as django_validate_password,
)
from ...models import EmailPIN, Purpose
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
import secrets
from django.core.validators import RegexValidator
import re

User = get_user_model()

RESERVED_USERNAMES = {"admin", "root", "support", "moderator", "staff"}


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField(
        required=True,
        min_length=3,
        max_length=30,
        validators=[
            RegexValidator(
                regex=r"^[a-zA-Z0-9_]+$",
                message="Username может содержать только буквы, цифры и _",
            )
        ],
    )
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    gender = serializers.ChoiceField(
        choices=["male", "female", "other"],
        required=False,
        allow_blank=True
    )

    def validate_email(self, value):
        value = User.objects.normalize_email(value)
        existing_user = User.objects.filter(email__iexact=value).first()
        if existing_user and existing_user.is_active:
            raise serializers.ValidationError("Email is already in use.")
        return value

    def validate_username(self, value):
        value = value.strip()

        if value.lower() in RESERVED_USERNAMES:
            raise serializers.ValidationError("Этот username зарезервирован.")

        email = self.initial_data.get("email")
        existing_temp_user = User.objects.filter(email__iexact=email, is_active=False).first()
        
        if existing_temp_user:
            if User.objects.filter(username__iexact=value).exclude(id=existing_temp_user.id).exists():
                raise serializers.ValidationError("Username is already in use.")
        else:
            if User.objects.filter(username__iexact=value).exists():
                raise serializers.ValidationError("Username is already in use.")

        return value

    def validate_password(self, value):
        if " " in value:
            raise serializers.ValidationError("Password must not contain spaces")

        temp_user = User(
            username=self.initial_data.get("username"),
            email=self.initial_data.get("email"),
        )

        try:
            django_validate_password(value, user=temp_user)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        email = validated_data.get("email")
        
        existing_user = User.objects.filter(email__iexact=email, is_active=False).first()
        
        if existing_user:
            for key, value in validated_data.items():
                setattr(existing_user, key, value)
            existing_user.set_password(password)
            existing_user.is_active = True
            existing_user.save()
            user = existing_user
        else:
            user = User(**validated_data)
            user.set_password(password)
            user.save()
            
        pin_code = EmailPIN.objects.create(
            purpose=Purpose.REGISTER,
            user_id=user.id,
            email=user.email,
            pin=f"{secrets.randbelow(10**6):06d}",
        )
        html_message = render_to_string(
            "users/emails/verification_email.html", {"user": user, "pin_code": pin_code}
        )
        try:
            send_mail(
                subject="Verify your email",
                message="Verify your email",
                html_message=html_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
            )
        except Exception:
            pass
        return user

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "email",
            "username",
            "password",
            "date_of_birth",
            "gender",
        ]
        extra_kwargs = {
            "password": {"write_only": True, "style": {"input_type": "password"}}
        }
