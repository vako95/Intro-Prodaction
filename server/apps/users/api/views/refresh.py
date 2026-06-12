from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import status
from rest_framework.response import Response
from ..serializers import RefreshSerializer
from core.responses import ResponseBuilder


class RefreshView(TokenRefreshView):
    serializer_class = RefreshSerializer

    def post(self, request, *args, **kwargs) -> Response:
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        access = serializer.validated_data["access"]
        refresh = serializer.validated_data.get("refresh")

        response = ResponseBuilder.success(
            data={
                "access": access,
                "refresh": refresh
            }
        ).raw()
        response.set_cookie(
            "refresh",
            refresh,
            httponly=True,
            secure=False,
            samesite="Lax",
        )

        return response
