from rest_framework.views import APIView
from ..serializers import (
    ResetPasswordRequestSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetChangeSerializer,
)


from rest_framework.views import APIView


from core.responses import ResponseBuilder
from rest_framework.views import APIView
from ..serializers import ResetPasswordRequestSerializer


class PasswordResetRequestView(APIView):
    serializer_class = ResetPasswordRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return ResponseBuilder.success(
            detail="PIN and reset link sent to your email",
            # message="PIN and reset link sent to your email",
        ).standard()


class PasswordResetConfirmView(APIView):
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()

        return ResponseBuilder.success(
            detail="PIN and reset link sent to your email",
            data={
                "success": True,
                "token": data["token_obj"].token,
            },
        ).standard()


class PasswordResetChangeView(APIView):
    serializer_class = PasswordResetChangeSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return ResponseBuilder.success(
            detail="Password has been reset successfully",
        ).standard()
