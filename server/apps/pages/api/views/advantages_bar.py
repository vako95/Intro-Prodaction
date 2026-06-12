from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework import status
from ..serializers import AdvantagesBarListSerializer
from ...models import AdvantagesBar
from core.responses import ResponseBuilder


class AdvantagesBarListView(APIView):
    serializer_class = AdvantagesBarListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return AdvantagesBar.objects.active()

    def get(self, request):
        queryset = self.get_queryset()

        serializer = self.serializer_class(
            instance=queryset,
            many=True,
            context={"request": request},
        )

        return ResponseBuilder.success(
            detail="Advantages bars retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()
