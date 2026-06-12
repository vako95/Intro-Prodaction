# from rest_framework import serializers

# from apps.pages.models.icons import Icons
# from ...models import Icon


# class IconListSerializer(serializers.ModelSerializer):
#     icon = serializers.CharField(source="key", read_only=True)

#     class Meta:
#         model = Icon
#         fields = (
#             "id",
#             "icon",
#             "label",
#         )
#         read_only_fields = ("id",)
