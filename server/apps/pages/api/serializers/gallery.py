from rest_framework import serializers

from ...models import HotelGallery, GalleryCategory
from ..mixins.translations import TranslationMixin


class GalleryCategoryTranslationMixin(TranslationMixin):
    """Миксин для переводов полей категории галереи"""

    def get_name(self, obj):
        return self.get_translated_field(obj, "name")

    def get_description(self, obj):
        return self.get_translated_field(obj, "description")


class GalleryCategorySerializer(
    GalleryCategoryTranslationMixin, serializers.ModelSerializer
):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = GalleryCategory
        fields = (
            "id",
            "name",
            "description",
            "slug",
            "order",
        )


class HotelGalleryTranslationMixin(TranslationMixin):
    """Миксин для переводов полей галереи"""

    def get_title(self, obj):
        return self.get_translated_field(obj, "title")

    def get_description(self, obj):
        return self.get_translated_field(obj, "description")


class HotelGallerySerializer(
    HotelGalleryTranslationMixin, serializers.ModelSerializer
):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    category = GalleryCategorySerializer(read_only=True)

    class Meta:
        model = HotelGallery
        fields = (
            "id",
            "title",
            "description",
            "image",
            "thumbnail",
            "category",
            "order",
            "is_featured",
        )
