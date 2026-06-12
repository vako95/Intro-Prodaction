from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Avg
from rest_framework import permissions
from rest_framework import status

from ..serializers import (
    ReviewCreateSerializer,
    ReviewListSerializer,
    ReviewUpdateSerializer,
)
from core.responses import ResponseBuilder
from ...models import Review


class ReviewListView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ReviewListSerializer

    def get_queryset(self):
        return (
            Review.objects.select_related("author")
            .annotate(average_rating=Avg("ratings__rating"))
            .filter(is_active=True)
            .order_by("-created_at")
        )

    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(
            queryset,
            many=True,
            context={"request": request},
        )
        return ResponseBuilder.success(
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()


class ReviewCreateView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = ReviewCreateSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)

        return ResponseBuilder.success(
            detail="Review submitted successfully",
            data=serializer.data,
            status_code=status.HTTP_201_CREATED,
        ).standard()


class ReviewUpdateView(APIView):
    serializer_class = ReviewUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, slug, user):
        return get_object_or_404(
            Review,
            slug=slug,
            author=user,
            is_active=True,
        )

    def get(self, request, slug):
        review = self.get_object(slug, request.user)

        serializer = self.serializer_class(
            review,
            context={"request": request},
        )

        return ResponseBuilder.success(
            detail="Review retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()

    def patch(self, request, slug):
        review = self.get_object(slug, request.user)

        serializer = self.serializer_class(
            review,
            data=request.data,
            context={"request": request},
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return ResponseBuilder.success(
            detail="Review updated successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()


class ReviewDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, slug):

        return get_object_or_404(
            Review,
            slug=slug,
            author=self.request.user,
            is_active=True,
        )

    def delete(self, request, slug):
        review = self.get_object(slug)
        if request.user != review.author:
            return ResponseBuilder.error(
                detail="You do not have permission to delete this review.",
                status_code=status.HTTP_403_FORBIDDEN,
            ).standard()
        review.is_active = False
        review.save(update_fields=["is_active"])

        return ResponseBuilder.success(
            detail="Review deleted successfully",
            status_code=status.HTTP_204_NO_CONTENT,
        ).standard()
