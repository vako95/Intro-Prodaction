from rest_framework import status, permissions
from rest_framework.views import APIView
from ..serializers import SocialSerializer
from core.responses import ResponseBuilder
from ...models import Social


class SocialListView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SocialSerializer

    def get(self, requset):
        queryset = Social.objects.all()
        serializer = self.serializer_class(
            instance=queryset,
            many=True,
            context={"request": requset},
        )

        return ResponseBuilder.success(
            detail="Rooms retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()
