from rest_framework import serializers
from apps.pages.models import Quote
from ..mixins.translations import TranslationMixin


class QuoteTranslationMixin(TranslationMixin):

    def get_name(self, obj):
        return self.get_translated_field(obj, "name")

    def get_position(self, obj):
        return self.get_translated_field(obj, "position")

    def get_quote(self, obj):
        return self.get_translated_field(obj, "quote")


class QuoteSerializer(QuoteTranslationMixin, serializers.ModelSerializer):

    name = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()
    quote = serializers.SerializerMethodField()

    class Meta:
        model = Quote
        fields = [
            "id",
            "name",
            "position",
            "quote",
            "image",
            "is_verified",
            "order",
            "is_active",
            "created_at",
        ]
