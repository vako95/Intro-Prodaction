from rest_framework import serializers
from ...models import Service, ServiceVideo, ServiceFeature, ServiceFeatureItem
from ..mixins import TranslationMixin


class ServiceVideoSerializer(serializers.ModelSerializer):
    video = serializers.SerializerMethodField()

    class Meta:
        model = ServiceVideo
        fields = ("id", "video")

    def get_video(self, obj):
        if obj.video_url:
            return obj.video_url

        if obj.video_file:
            request = self.context.get("request")
            return (
                request.build_absolute_uri(obj.video_file.url)
                if request
                else obj.video_file.url
            )

        return None


class ServiceFeatureItemSerializer(TranslationMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()

    def get_title(self, obj):
        return self.get_translated_field(obj, "title")

    class Meta:
        model = ServiceFeatureItem
        fields = (
            "id",
            "title",
            "icon",
        )
        read_only_fields = (
            "id",
            "icon",
        )


class ServiceFeatureSerializer(TranslationMixin, serializers.ModelSerializer):
    subtitle = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()

    content = serializers.SerializerMethodField()

    def get_subtitle(self, obj):
        return self.get_translated_field(obj, "subtitle")

    def get_title(self, obj):
        return self.get_translated_field(obj, "title")

    def get_content(self, obj):
        return self.get_translated_field(obj, "content")

    class Meta:
        model = ServiceFeature
        fields = (
            "id",
            "subtitle",
            "title",
            "content",
        )
        read_only_fields = ("id",)


class ServiceListSerializer(TranslationMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    feature = ServiceFeatureSerializer(read_only=True)
    feature_items = ServiceFeatureItemSerializer(many=True, read_only=True)
    videos = ServiceVideoSerializer(many=True, read_only=True)

    def get_title(self, obj):
        return self.get_translated_field(obj, "title")

    def get_description(self, obj):
        return self.get_translated_field(obj, "description")

    class Meta:
        model = Service
        fields = (
            "id",
            "slug",
            "card_icon",
            "cover_img",
            "card_image",
            "title",
            "description",
            "feature",
            "feature_items",
            "videos",
        )
        read_only_fields = ("id", "slug")


class ServiceDetailSerializer(TranslationMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    feature = ServiceFeatureSerializer(read_only=True)
    feature_items = ServiceFeatureItemSerializer(many=True, read_only=True)
    videos = ServiceVideoSerializer(many=True, read_only=True)

    def get_title(self, obj):
        return self.get_translated_field(obj, "title")

    def get_description(self, obj):
        return self.get_translated_field(obj, "description")

    class Meta:
        model = Service
        fields = (
            "id",
            "title",
            "description",
            "cover_img",
            "card_image",
            "card_icon",
            "feature",
            "feature_items",
            "videos",
            "slug",
        )
        read_only_fields = ("id", "slug")
