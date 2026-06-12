from rest_framework import serializers

from ...models import FAQ
from ..mixins.translations import TranslationMixin


class FAQTranslationMixin(TranslationMixin):

    def get_question(self, obj):
        return self.get_translated_field(obj, "question")

    def get_answer(self, obj):
        return self.get_translated_field(obj, "answer")


class FAQSerializer(FAQTranslationMixin, serializers.ModelSerializer):
    question = serializers.SerializerMethodField()
    answer = serializers.SerializerMethodField()

    class Meta:
        model = FAQ
        fields = (
            "id",
            "question",
            "answer",
            "category",
            "order",
        )
