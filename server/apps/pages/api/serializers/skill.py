from rest_framework import serializers
from ...models.personal import PersonalSkill
from ..mixins import TranslationMixin


class PersonalSkillSerializer(TranslationMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, obj) -> str:
        return self.get_translated_field(obj, "name")

    class Meta:
        model = PersonalSkill
        fields = (
            "id",
            "name",
            "value",
            "order",
        )
        read_only_fields = ("id",)
