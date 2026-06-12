from rest_framework.views import APIView
from rest_framework import status

from ..serializers import LogoutSerializer
from core.responses import ResponseBuilder


class LogoutView(APIView):
    serializer_class = LogoutSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response = ResponseBuilder.success(status_code=status.HTTP_204_NO_CONTENT).raw()
        response.delete_cookie("refresh")
        return response
