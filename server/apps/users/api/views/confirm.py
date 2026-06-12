from rest_framework.views import APIView
from core.responses import ResponseBuilder

from ..serializers import EmailVerificationSerializer, EmailSendSerializer


class EmailSendView(APIView):
    serializer_class = EmailSendSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return ResponseBuilder.success(
            detail="PIN and reset link sent to your email.",
        ).standard()


class EmailVerificationView(APIView):
    serializer_class = EmailVerificationSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return ResponseBuilder.success(
            detail=f"Email {user.email} successfully verified."
        ).standard()
