from rest_framework import serializers
from ...models import News, Category, Tag, NewsComment, NewsCommentRating
from ..mixins import TranslationMixin
from django.contrib.auth import get_user_model
from django.db.models import Count, Avg
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from .category import CategorySerializer
from .tag import TagSerializer

User = get_user_model()


class MessageValidationMixin:
    def validate_message(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Message cannot be empty")
        if len(value) < 3:
            raise serializers.ValidationError("Message too short")
        if len(value) > 1000:
            raise serializers.ValidationError("Message too long")

        return value.strip()


class NewsAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
        )
        read_only_fields = fields


class NewsCommentRatingListSerializer(serializers.ModelSerializer):
    author = NewsAuthorSerializer(read_only=True)

    class Meta:
        model = NewsCommentRating
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


class NewsCommentRatingCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = NewsCommentRating
        fields = (
            "rating",
            "comment",
        )

    def validate_comment(self, value):
        if not value.is_active:
            raise ValidationError(
                detail="Cannot rate an inactive comment.",
                code="INACTIVE_COMMENT",
            )
        return value

    def validate(self, data):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        comment = data.get("comment")
        if not user or not user.is_authenticated:
            raise AuthenticationFailed(
                detail="Authentication is required to rate comments.",
                code="AUTHENTICATION_REQUIRED",
            )
        if NewsCommentRating.objects.filter(comment=comment, author=user).exists():
            raise ValidationError(
                detail="You have already rated this comment.",
                code="RATING_ALREADY_EXISTS",
            )
        return data


class NewsCommentRatingUpdateSerializer(serializers.ModelSerializer):
    author = NewsAuthorSerializer(read_only=True)

    class Meta:
        model = NewsCommentRating
        fields = ("id", "rating")
        read_only_fields = (
            "id",
            "author",
        )

    def validate(self, data):
        request = self.context.get("request")
        user = getattr(request, "user", None)

        if not user or not user.is_authenticated:
            raise AuthenticationFailed(
                detail="Authentication is required to update ratings.",
                code="AUTHENTICATION_REQUIRED",
            )
        if self.instance and self.instance.author != user:
            raise ValidationError(
                detail="You can only update your own ratings",
                code="PERMISSION_DENIED",
            )
        return data


class NewsListSerializer(TranslationMixin, serializers.ModelSerializer):
    author = NewsAuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tag = TagSerializer(many=True, read_only=True)
    title = serializers.SerializerMethodField()

    def get_title(self, obj):
        return self.get_translated_field(obj, "title")

    class Meta:
        model = News
        fields = (
            "id",
            "title",
            "author",
            "category",
            "tag",
            "slug",
            "poster",
            "created_at",
        )
        read_only_fields = ("id", "author", "created_at")


class NewsCommentListSerializer(serializers.ModelSerializer):
    author = NewsAuthorSerializer(read_only=True)
    ratings_count = serializers.IntegerField(read_only=True)
    ratings = NewsCommentRatingListSerializer(many=True, read_only=True)
    avg_rating = serializers.FloatField(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = NewsComment
        fields = (
            "id",
            "news",
            "author",
            "message",
            "ratings",
            "ratings_count",
            "avg_rating",
            "parent",
            "replies",
            "created_at",
        )
        read_only_fields = (
            "id",
            "author",
            "created_at",
        )

    def get_replies(self, obj):
        if obj.replies.exists():
            return NewsCommentListSerializer(
                obj.replies.filter(is_active=True).annotate(
                    ratings_count=Count("ratings", distinct=True),
                    avg_rating=Avg("ratings__rating"),
                ),
                many=True,
                context=self.context
            ).data
        return []


class NewsDetailSerializer(TranslationMixin, serializers.ModelSerializer):
    author = NewsAuthorSerializer(read_only=True)
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)
    tag = TagSerializer(many=True, read_only=True)
    comments_count = serializers.IntegerField(read_only=True)
    comments = NewsCommentListSerializer(many=True, read_only=True)

    def get_title(self, obj):
        return self.get_translated_field(obj, "title")

    def get_content(self, obj):
        return self.get_translated_field(obj, "content")

    class Meta:
        model = News
        fields = (
            "id",
            "title",
            "content",
            "author",
            "category",
            "tag",
            "comments",
            "comments_count",
            "poster",
            "slug",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "author",
            "created_at",
            "updated_at",
        )


class NewsCommentCreateSerializer(MessageValidationMixin, serializers.ModelSerializer):

    class Meta:
        model = NewsComment
        fields = ("id", "message", "parent")


class NewsCommentUpdateSerializer(MessageValidationMixin, serializers.ModelSerializer):

    class Meta:
        model = NewsComment
        fields = ("id", "message")
