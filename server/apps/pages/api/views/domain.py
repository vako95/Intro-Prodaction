from rest_framework import permissions, status
from rest_framework.views import APIView
from ..serializers import DomainSerializer
from ...models import Domain
from core.responses import ResponseBuilder


class DomainListView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = DomainSerializer

    def get_queryset(self):
        return Domain.active.all()

    def get(self, request):
        queryset = self.get_queryset()

        serializer = self.serializer_class(
            instance=queryset,
            many=True,
            context={"request": request},
        )

        return ResponseBuilder.success(
            data=serializer.data,
            detail="Domains retrieved successfully",
            status_code=status.HTTP_200_OK,
        ).standard()
