from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(), message="Email is already used :("
            )
        ],
    )

    username = serializers.CharField(
        min_length=3,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(), message="Username is already used!"
            )
        ],
    )

    def validate_username(self, value):
        value = value.strip().lower()
        if not value.replace("_", "").isalnum():
            raise serializers.ValidationError(
                "Username can only contain letters, numbers, and underscores"
            )
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.is_active = False
        user.save()
        return user

    class Meta:
        model = User
        fields = ["email", "username", "password", "first_name", "last_name"]

    extra_kwargs = {"password": {"write_only": True}}
