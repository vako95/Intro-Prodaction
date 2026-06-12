from rest_framework import generics
from ..paginations import CustomPageNumberPagination
from apps.pages.models import Quote
from apps.pages.api.serializers import QuoteSerializer
from rest_framework.pagination import PageNumberPagination


class QuoteListView(generics.ListAPIView):
    pagination_class = CustomPageNumberPagination
    serializer_class = QuoteSerializer

    def get_queryset(self):
        return Quote.objects.filter(is_active=True).order_by(
            "order",
            "-created_at",
        )
