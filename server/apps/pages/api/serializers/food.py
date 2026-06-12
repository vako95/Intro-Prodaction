from ...models import Food
from . import CategorySerializer, DomainSerializer, TagSerializer
from rest_framework import serializers
from ..mixins import TranslationMixin


class FoodSerializer(TranslationMixin, serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    domain = DomainSerializer(read_only=True)
    tag = TagSerializer(many=True, read_only=True)
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
        model = Food
        fields = (
            "id",
            "title",
            "subtitle",
            "price",
            "poster",
            "slug",
            "tag",
            "description",
            "category",
            "domain",
        )
