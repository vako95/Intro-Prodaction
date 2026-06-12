from rest_framework import serializers
from ...models import Brand
from ..mixins import TranslationMixin


class BrandListSerializer(TranslationMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, obj) -> str:
        return self.get_translated_field(obj, "name")

    class Meta:
        model = Brand
        fields = (
            "id",
            "name",
            "slug",
            "logo",
            "logo_svg",
        )
