from rest_framework import serializers
from ...models import Swap
from ..mixins import TranslationMixin


class SwapSerializer(TranslationMixin, serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    def get_label(self, obj) -> str:
        return self.get_translated_field(obj, "label")

    def get_title(self, obj) -> str:
        return self.get_translated_field(obj, "title")

    def get_content(self, obj) -> str:
        return self.get_translated_field(obj, "content")

    class Meta:
        model = Swap
        fields = (
            "id",
            "label",
            "title",
            "content",
            "poster",
            "slug",
        )
        read_only_fields = (
            "id",
            "slug",
        )
