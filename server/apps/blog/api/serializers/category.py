from rest_framework import serializers
from ...models import Category

from ..mixins import TranslationMixin


class CategorySerializer(TranslationMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    news_count = serializers.IntegerField(read_only=True, default=0)

    def get_title(self, obj):
        return self.get_translated_field(obj, "title")

    class Meta:
        model = Category
        fields = (
            "id",
            "title",
            "slug",
            "domain",
            "poster",
            "news_count",
        )
        read_only_fields = (
            "id",
            "slug",
            "news_count",
        )
