from rest_framework import serializers
from ...models.personal import Personal
from .personal_social_link import PersonalSocialLinkSerializer
from .skill import PersonalSkillSerializer
from ..mixins import TranslationMixin


class PersonalSerializer(TranslationMixin, serializers.ModelSerializer):
    social = PersonalSocialLinkSerializer(source='social_links', many=True, read_only=True)
    skills = PersonalSkillSerializer(many=True, read_only=True)
    name = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()

    def get_name(self, obj) -> str:
        return self.get_translated_field(obj, "name")

    def get_role(self, obj) -> str:
        return self.get_translated_field(obj, "role")
    
    def get_bio(self, obj) -> str:
        return self.get_translated_field(obj, "bio")

    class Meta:
        model = Personal
        fields = (
            "id",
            "name",
            "role",
            "bio",
            "poster",
            "email",
            "phone",
            "age",
            "blood_group",
            "website",
            "address",
            "social",
            "skills",
            "slug",
            "created_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "social",
            "skills",
            "slug",
        )
