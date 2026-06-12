from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from core.responses import ResponseBuilder

from ...models import FAQ
from ..serializers.faq import FAQSerializer


class FAQListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        faqs = FAQ.objects.filter(is_active=True).order_by("category", "order", "-created_at")

        serializer = FAQSerializer(faqs, many=True, context={"request": request})

        return ResponseBuilder.success(
            detail="FAQs retrieved successfully",
            data=serializer.data,
        ).standard()
