from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from core.responses import ResponseBuilder

from ...models import HotelGallery, GalleryCategory
from ..serializers.gallery import HotelGallerySerializer, GalleryCategorySerializer


class HotelGalleryListView(APIView):
    """Get all active gallery images"""
    
    permission_classes = [AllowAny]

    def get(self, request):
        # Get category filter from query params
        category_slug = request.query_params.get('category')
        is_featured = request.query_params.get('featured')
        
        queryset = HotelGallery.objects.select_related('category').filter(
            is_active=True
        )
        
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
            
        if is_featured:
            queryset = queryset.filter(is_featured=True)
        
        queryset = queryset.order_by('category__order', 'order', '-created_at')
        
        serializer = HotelGallerySerializer(
            queryset, many=True, context={"request": request}
        )

        return ResponseBuilder.success(
            detail="Gallery images retrieved successfully",
            data=serializer.data,
        ).standard()


class GalleryCategoryListView(APIView):
    """Get all gallery categories"""
    
    permission_classes = [AllowAny]

    def get(self, request):
        categories = GalleryCategory.objects.filter(
            is_active=True
        ).order_by('order', 'name_en')
        
        serializer = GalleryCategorySerializer(
            categories, many=True, context={"request": request}
        )

        return ResponseBuilder.success(
            detail="Gallery categories retrieved successfully",
            data=serializer.data,
        ).standard()
