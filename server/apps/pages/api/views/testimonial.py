from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from core.responses import ResponseBuilder

from ...models import Testimonial
from ..serializers.testimonial import TestimonialSerializer


class TestimonialListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """Get all active testimonials"""
        testimonials = Testimonial.objects.filter(is_active=True).order_by(
            "order", "-created_at"
        )

        serializer = TestimonialSerializer(
            testimonials, many=True, context={"request": request}
        )

        return ResponseBuilder.success(
            detail="Testimonials retrieved successfully",
            data=serializer.data,
        ).standard()
