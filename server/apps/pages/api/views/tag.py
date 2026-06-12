from rest_framework.views import APIView
from rest_framework import status, permissions
from core.responses import ResponseBuilder
from ..serializers.tag import TagSerializer
from ...models import Tag


class TagListView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TagSerializer

    def get_queryset(self):
        return Tag.objects.active()

    def get(self, request):
        queryset = self.get_request()
        serializer = self.serializer_class(
            instance=queryset,
            many=True,
            context={"request": request},
        )
        return ResponseBuilder.success(
            detail="Tag retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()
