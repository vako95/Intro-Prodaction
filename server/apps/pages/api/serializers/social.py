from rest_framework import serializers
from ...models import Social
from ..mixins import TranslationMixin


class SocialSerializer(TranslationMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()

    def get_title(self, obj) -> str:
        return self.get_translated_field(obj, "title")

    class Meta:
        model = Social
        fields = (
            "id",
            "title",
            "icon",
        )
        read_only_fields = ("id",)
