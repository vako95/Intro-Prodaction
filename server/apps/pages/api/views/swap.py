from rest_framework.views import APIView
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from ...models import Swap
from ..serializers import SwapSerializer
from core.responses import ResponseBuilder


class SwapListView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SwapSerializer

    def get_queryset(self):
        return Swap.objects.active()

    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(
            instance=queryset,
            many=True,
            context={"request": request},
        )

        return ResponseBuilder.success(
            detail="Swaps retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()


class SwapDetailView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SwapSerializer

    def get_queryset(self):
        return Swap.objects.active()

    def get(self, request, slug):
        queryset = self.get_queryset()
        swap = get_object_or_404(queryset, slug=slug)
        serializer = self.serializer_class(
            instance=swap,
            context={"request": request},
        )

        return ResponseBuilder.success(
            detail="Swap retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()
