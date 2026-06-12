from rest_framework import serializers
from ...models import Tag
from ..mixins import TranslationMixin


class TagSerializer(TranslationMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    news_count = serializers.IntegerField(read_only=True, default=0)

    def get_name(self, obj):
        return self.get_translated_field(obj, "name")

    class Meta:
        model = Tag
        fields = (
            "id",
            "name",
            "slug",
            "news_count",
        )
        read_only_fields = (
            "id",
            "slug",
            "news_count",
        )
