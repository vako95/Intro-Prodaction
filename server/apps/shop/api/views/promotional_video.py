from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from core.responses import ResponseBuilder

from ...models import PromotionalVideo
from ..serializers.promotional_video import PromotionalVideoSerializer


class PromotionalVideoView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """Get active promotional video"""
        video = (
            PromotionalVideo.objects.filter(is_active=True)
            .order_by("order", "-created_at")
            .first()
        )

        if not video:
            return ResponseBuilder.error(
                detail="No promotional video found",
                status_code=status.HTTP_404_NOT_FOUND,
            ).standard()

        serializer = PromotionalVideoSerializer(video, context={"request": request})

        return ResponseBuilder.success(
            detail="Promotional video retrieved successfully",
            data=serializer.data,
        ).standard()
