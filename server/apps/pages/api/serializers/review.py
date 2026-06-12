from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Avg
from ...models import Review, ReviewRating
from ..mixins import TranslationMixin

User = get_user_model()


class ReviewUserSerializer(TranslationMixin, serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
        )


class ReviewTranslationMixin(TranslationMixin):
    """Миксин для переводов полей review"""

    def get_message(self, obj):
        return self.get_translated_field(obj, "message")


class ReviewListSerializer(ReviewTranslationMixin, serializers.ModelSerializer):
    author = ReviewUserSerializer(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    message = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = (
            "id",
            "message",
            "average_rating",
            "author",
            "created_at",
        )
        read_only_fields = (
            "id",
            "author",
            "created_at",
        )


class ReviewCreateSerializer(serializers.ModelSerializer):
    author = ReviewUserSerializer(read_only=True)
    message = serializers.CharField(min_length=10, required=False, allow_blank=True)
    message_az = serializers.CharField(min_length=10, required=False, allow_blank=True)
    message_ru = serializers.CharField(min_length=10, required=False, allow_blank=True)
    message_en = serializers.CharField(min_length=10, required=False, allow_blank=True)

    def validate_message(self, value):
        if value:
            value = value.strip()
            if len(value) < 10:
                raise serializers.ValidationError(
                    "Message must be at least 10 characters long!"
                )
        return value

    def validate_message_az(self, value):
        if value:
            value = value.strip()
            if len(value) < 10:
                raise serializers.ValidationError(
                    "Message (AZ) must be at least 10 characters long!"
                )
        return value

    def validate_message_ru(self, value):
        if value:
            value = value.strip()
            if len(value) < 10:
                raise serializers.ValidationError(
                    "Message (RU) must be at least 10 characters long!"
                )
        return value

    def validate_message_en(self, value):
        if value:
            value = value.strip()
            if len(value) < 10:
                raise serializers.ValidationError(
                    "Message (EN) must be at least 10 characters long!"
                )
        return value

    class Meta:
        model = Review
        fields = (
            "id",
            "message",
            "message_az",
            "message_ru",
            "message_en",
        )
        read_only_fields = (
            "id",
            "author",
        )


class ReviewUpdateSerializer(serializers.ModelSerializer):
    author = ReviewUserSerializer(read_only=True)
    message = serializers.CharField(min_length=10, required=False, allow_blank=True)
    message_az = serializers.CharField(min_length=10, required=False, allow_blank=True)
    message_ru = serializers.CharField(min_length=10, required=False, allow_blank=True)
    message_en = serializers.CharField(min_length=10, required=False, allow_blank=True)

    def validate_message(self, value):
        if value:
            value = value.strip()
            if len(value) < 10:
                raise serializers.ValidationError(
                    "Message must be at least 10 characters long!"
                )
        return value

    def validate_message_az(self, value):
        if value:
            value = value.strip()
            if len(value) < 10:
                raise serializers.ValidationError(
                    "Message (AZ) must be at least 10 characters long!"
                )
        return value

    def validate_message_ru(self, value):
        if value:
            value = value.strip()
            if len(value) < 10:
                raise serializers.ValidationError(
                    "Message (RU) must be at least 10 characters long!"
                )
        return value

    def validate_message_en(self, value):
        if value:
            value = value.strip()
            if len(value) < 10:
                raise serializers.ValidationError(
                    "Message (EN) must be at least 10 characters long!"
                )
        return value

    class Meta:
        model = Review
        fields = ("message", "message_az", "message_ru", "message_en")


class ReviewRatingListSerializer(serializers.ModelSerializer):
    author = ReviewUserSerializer(read_only=True)

    class Meta:
        model = ReviewRating
        fields = (
            "id",
            "author",
            "rating",
            "created_at",
        )
        read_only_fields = (
            "id",
            "author",
            "created_at",
        )


class ReviewRatingCreateSerializer(serializers.ModelSerializer):
    author = ReviewUserSerializer(read_only=True)
    rating = serializers.ChoiceField(choices=ReviewRating.RATING_CHOICES)

    class Meta:
        model = ReviewRating
        fields = (
            "rating",
            "review",
        )


class ReviewRatingDeleteSerializer(serializers.ModelSerializer):
    pass
