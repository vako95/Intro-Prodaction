from rest_framework.views import APIView

from rest_framework import status, permissions


from django.contrib.auth import get_user_model

from core.responses import ResponseBuilder
from ..serializers import ProfileSerializer

User = get_user_model()


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer

    def get(self, request):
        serializer = self.serializer_class(
            instance=request.user,
            context={"request": request},
        )
        return ResponseBuilder.success(
            detail="User profile retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()

    def post(self, request):
        serializer = self.serializer_class(
            instance=request.user,
            data=request.data,
            context={"request": request},
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return ResponseBuilder.success(
            detail="User profile updated successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()
