from rest_framework import serializers
from ...models import Tag
from ..mixins import TranslationMixin


class TagSerializer(TranslationMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, obj) -> str:
        return self.get_translated_field(obj, "name")

    class Meta:
        model = Tag
        fields = (
            "id",
            "name",
            "slug",
        )
        read_only_fields = (
            "id",
            "slug",
        )
