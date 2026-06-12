from rest_framework import serializers
from ...models.personal import PersonalSocialLink


class PersonalSocialLinkSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='social.title_en', read_only=True)
    icon = serializers.CharField(source='social.icon', read_only=True)
    
    class Meta:
        model = PersonalSocialLink
        fields = (
            "id",
            "title",
            "icon",
            "url",
            "order",
        )
        read_only_fields = ("id", "title", "icon")
