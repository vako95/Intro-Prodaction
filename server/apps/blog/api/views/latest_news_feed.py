from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status

from core.responses import ResponseBuilder

from ...models import News
from ..serializers import NewsListSerializer


class LatestNewsFeedView(APIView):
    """Endpoint for latest news feed - returns last N news items"""
    
    permission_classes = [AllowAny]
    serializer_class = NewsListSerializer

    def get(self, request):
        # Get limit from query params, default to 4
        limit = int(request.query_params.get('limit', 4))
        
        news = (
            News.objects.select_related("author", "category")
            .filter(is_active=True)
            .order_by("-created_at")[:limit]
        )
        
        serializer = self.serializer_class(
            news, 
            many=True, 
            context={"request": request}
        )
        
        return ResponseBuilder.success(
            detail="Latest news feed retrieved successfully",
            data=serializer.data,
        ).standard()
