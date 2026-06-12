from rest_framework import serializers
from ...models import Domain
from ..mixins import TranslationMixin


class DomainSerializer(TranslationMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, obj) -> str:
        return self.get_translated_field(obj, "name")

    class Meta:
        model = Domain
        fields = (
            "id",
            "name",
            "slug",
        )
