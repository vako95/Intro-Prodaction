from rest_framework import serializers

from ...models import PromotionalVideo
from ..mixins import TranslationMixin


class PromotionalVideoTranslationMixin(TranslationMixin):
    """Миксин для переводов полей promotional video"""

    def get_title(self, obj):
        return self.get_translated_field(obj, "title")

    def get_subtitle(self, obj):
        return self.get_translated_field(obj, "subtitle")


class PromotionalVideoSerializer(
    PromotionalVideoTranslationMixin, serializers.ModelSerializer
):
    title = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()
    video_id = serializers.CharField(source="youtube_video_id", read_only=True)

    class Meta:
        model = PromotionalVideo
        fields = (
            "id",
            "title",
            "subtitle",
            "youtube_url",
            "video_id",
            "background_image",
            "is_active",
            "order",
        )
