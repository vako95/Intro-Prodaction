from rest_framework.views import APIView
from rest_framework import permissions, status

from ...models import Brand
from ..serializers import BrandListSerializer
from core.responses import ResponseBuilder


class BrandListView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = BrandListSerializer

    def get_queryset(self):
        return Brand.objects.active()

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(
            instance=queryset,
            many=True,
            context={"request": request},
        )

        return ResponseBuilder.success(
            data=serializer.data,
            detail="Brands retrieved successfully",
            status_code=status.HTTP_200_OK,
        ).standard()
