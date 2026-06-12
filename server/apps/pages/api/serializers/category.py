from rest_framework import serializers

from .domain import DomainSerializer

from ...models import Category
from ..mixins import TranslationMixin


class CategorySerializer(TranslationMixin, serializers.ModelSerializer):
    domain = DomainSerializer(read_only=True)
    title = serializers.SerializerMethodField()

    def get_title(self, obj) -> str:
        return self.get_translated_field(obj, "title")

    class Meta:
        model = Category
        fields = (
            "id",
            "title",
            "name",
            "slug",
            "poster",
        )
