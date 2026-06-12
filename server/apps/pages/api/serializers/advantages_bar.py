from rest_framework import serializers
from ...models import AdvantagesBar
from ..mixins import TranslationMixin


class AdvantagesBarListSerializer(TranslationMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    def get_title(self, obj) -> str:
        return self.get_translated_field(obj, "title")

    def get_description(self, obj) -> str:
        return self.get_translated_field(obj, "description")

    class Meta:
        model = AdvantagesBar
        fields = (
            "id",
            "title",
            "description",
            "icon",
        )
        read_only_fields = ("id",)
