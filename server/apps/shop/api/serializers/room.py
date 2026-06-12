from datetime import datetime

from rest_framework import serializers

from ...models import Room, RoomIcon, RoomImg
from ...selectors import RoomSelector
from ..mixins import TranslationMixin


class RoomIconSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomIcon
        fields = ("id", "key", "label")


class RoomImgSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImg
        fields = ("id", "image")


class RoomTranslationMixin(TranslationMixin):
    """Миксин для переводов полей комнаты"""

    def get_title(self, obj):
        return self.get_translated_field(obj, "title")

    def get_subtitle(self, obj):
        return self.get_translated_field(obj, "subtitle")

    def get_excerpt(self, obj):
        return self.get_translated_field(obj, "excerpt")

    def get_view(self, obj):
        return self.get_translated_field(obj, "view")


class RoomListSerializer(RoomTranslationMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()
    view = serializers.SerializerMethodField()
    icons = RoomIconSerializer(many=True, read_only=True)
    final_price = serializers.FloatField(read_only=True)
    available_count = serializers.IntegerField(read_only=True, required=False)
    is_wishlisted = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = (
            "id",
            "title",
            "subtitle",
            "excerpt",
            "poster",
            "icons",
            "price",
            "discount",
            "final_price",
            "capacity_adult",
            "capacity_children",
            "capacity_total",
            "room_count",
            "available_count",
            "size",
            "beds",
            "view",
            "slug",
            "is_active",
            "is_wishlisted",
        )

    def get_is_wishlisted(self, obj):
        """Проверяет, находится ли комната в wishlist текущего пользователя"""
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            from ...models import Wishlist
            return Wishlist.objects.filter(user=request.user, room=obj).exists()
        return False


class RoomDetailSerializer(RoomTranslationMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    view = serializers.SerializerMethodField()
    icons = RoomIconSerializer(many=True, read_only=True)
    images = RoomImgSerializer(many=True, read_only=True)
    final_price = serializers.FloatField(read_only=True)
    available_rooms = serializers.SerializerMethodField()
    is_wishlisted = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = (
            "id",
            "title",
            "subtitle",
            "excerpt",
            "description",
            "poster",
            "icons",
            "images",
            "price",
            "discount",
            "final_price",
            "capacity_adult",
            "capacity_children",
            "capacity_total",
            "room_count",
            "available_rooms",
            "size",
            "beds",
            "view",
            "slug",
            "is_active",
            "is_wishlisted",
            "created_at",
            "updated_at",
        )

    def get_description(self, obj):
        return self.get_translated_field(obj, "description")

    def get_available_rooms(self, obj):
        check_in = self.context.get("check_in")
        check_out = self.context.get("check_out")

        if not (check_in and check_out):
            return obj.room_count

        try:
            check_in_date = datetime.strptime(check_in, "%Y-%m-%d").date()
            check_out_date = datetime.strptime(check_out, "%Y-%m-%d").date()
            return RoomSelector.get_available_rooms_count(obj, check_in_date, check_out_date)
        except (ValueError, TypeError):
            return obj.room_count

    def get_is_wishlisted(self, obj):
        """Проверяет, находится ли комната в wishlist текущего пользователя"""
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            from ...models import Wishlist
            return Wishlist.objects.filter(user=request.user, room=obj).exists()
        return False
