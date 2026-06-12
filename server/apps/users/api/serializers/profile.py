from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from django.contrib.auth import get_user_model

from django.contrib.auth.password_validation import (
    validate_password as django_validate_password,
)
from django.core.exceptions import ValidationError as DjangoValidationError

User = get_user_model()
RESERVED_USERNAMES = {"admin", "root", "support", "moderator", "staff"}


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="This email is already taken",
            )
        ],
    )
    username = serializers.CharField(
        required=True,
        min_length=3,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="This username is already taken",
            )
        ],
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance:
            self.fields["email"].validators[0].queryset = User.objects.exclude(
                pk=self.instance.pk
            )
            self.fields["username"].validators[0].queryset = User.objects.exclude(
                pk=self.instance.pk
            )

    def validate_username(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError(
                "Username must be at least 3 characters long"
            )
        if value.lower() in RESERVED_USERNAMES:
            raise serializers.ValidationError("This username is reserved")
        return value

    def validate_password(self, value):
        if " " in value:
            raise serializers.ValidationError("Password must not contain spaces")

        temp_user = User(
            username=self.initial_data.get("username", ""),
            email=self.initial_data.get("email", ""),
        )

        try:
            django_validate_password(value, user=temp_user)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        
        # Обработка удаления аватара
        if 'avatar' in validated_data and validated_data['avatar'] in [None, '', 'null']:
            if instance.avatar:
                instance.avatar.delete(save=False)
            validated_data['avatar'] = None
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "avatar",
            "date_of_birth",
            "gender",
            "is_active",
            "password",
            # Contact Information
            "phone",
            # Address Information
            "address",
            "city",
            "state",
            "postal_code",
            "country",
            # Additional Information
            "nationality",
            "passport_number",
            "emergency_contact_name",
            "emergency_contact_phone",
            # Preferences
            "preferred_language",
            "receive_newsletter",
            "receive_booking_notifications",
            # Metadata
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {
            "password": {
                "write_only": True,
                "required": False,
                "style": {"input_type": "password"},
            },
            "avatar": {
                "required": False,
                "allow_null": True,
            },
            "phone": {
                "required": False,
                "allow_blank": True,
                "allow_null": True,
            },
            "address": {
                "required": False,
                "allow_blank": True,
                "allow_null": True,
            },
            "city": {
                "required": False,
                "allow_blank": True,
                "allow_null": True,
            },
            "state": {
                "required": False,
                "allow_blank": True,
                "allow_null": True,
            },
            "postal_code": {
                "required": False,
                "allow_blank": True,
                "allow_null": True,
            },
            "country": {
                "required": False,
                "allow_blank": True,
                "allow_null": True,
            },
            "nationality": {
                "required": False,
                "allow_blank": True,
                "allow_null": True,
            },
            "passport_number": {
                "required": False,
                "allow_blank": True,
                "allow_null": True,
            },
            "emergency_contact_name": {
                "required": False,
                "allow_blank": True,
                "allow_null": True,
            },
            "emergency_contact_phone": {
                "required": False,
                "allow_blank": True,
                "allow_null": True,
            },
            "preferred_language": {
                "required": False,
                "allow_blank": True,
                "allow_null": True,
            },
        }
        read_only_fields = (
            "id",
            "is_active",
            "last_login",
            "date_joined",
            "created_at",
            "updated_at",
        )
