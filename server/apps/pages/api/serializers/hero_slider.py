from rest_framework import serializers
from ...models import HeroSlider
from .brand import BrandListSerializer
from ..mixins import TranslationMixin


class HeroSliderSerializer(TranslationMixin, serializers.ModelSerializer):
    brand = BrandListSerializer(read_only=True)
    title = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    def get_title(self, obj) -> str:
        return self.get_translated_field(obj, "title")

    def get_subtitle(self, obj) -> str:
        return self.get_translated_field(obj, "subtitle")

    def get_description(self, obj) -> str:
        return self.get_translated_field(obj, "description")

    class Meta:
        model = HeroSlider
        fields = (
            "id",
            "title",
            "subtitle",
            "description",
            "brand",
            "slug",
            "poster",
        )
        read_only_fields = (
            "id",
            "created_at",
            "brand",
            "slug",
        )
