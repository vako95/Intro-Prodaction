from rest_framework.views import APIView
from rest_framework import status, permissions
from ...models.service import ServiceVideo
from ..serializers import ServiceListSerializer
from ...models import Service

from core.responses import ResponseBuilder


class ServiceListView(APIView):
    serializer_class = ServiceListSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = (
            Service.objects.active()
            .select_related("feature")
            .prefetch_related("feature_items", "videos")
            .order_by("-id")
            .first()
        )

        serializer = self.serializer_class(
            instance=queryset,
            many=False,
            context={"request": request},
        )

        return ResponseBuilder.success(
            detail="Services retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()


# class RoomVideoViewSet(viewsets.ModelViewSet):
#     queryset = ServerVideo.objects.all()
#     serializer_class = ServerViodeoSerializer
