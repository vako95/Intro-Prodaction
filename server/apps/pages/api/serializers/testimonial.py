from rest_framework import serializers

from ...models import Testimonial
from ..mixins.translations import TranslationMixin


class TestimonialTranslationMixin(TranslationMixin):
    """Миксин для переводов полей testimonial"""

    def get_name(self, obj):
        return self.get_translated_field(obj, "name")

    def get_role(self, obj):
        return self.get_translated_field(obj, "role")

    def get_comment(self, obj):
        return self.get_translated_field(obj, "comment")


class TestimonialSerializer(TestimonialTranslationMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    comment = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = (
            "id",
            "name",
            "role",
            "comment",
            "image",
            "rating",
            "is_active",
            "order",
        )
