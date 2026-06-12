from rest_framework.permissions import AllowAny
from rest_framework import permissions, status
from rest_framework.views import APIView
from core.responses import ResponseBuilder
from ..serializers import CategorySerializer
from ...models import Category


class CategoryListView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.active()

    def get(self, request):
        queryset = self.get_queryset()

        serializer = self.serializer_class(
            instance=queryset,
            many=True,
            context={"request": request},
        )

        return ResponseBuilder.success(
            serializer.data,
            detail="Category retrieved successfully",
            status_code=status.HTTP_200_OK,
        ).standard()
