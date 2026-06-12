from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Count, Prefetch, Avg, Q
from django.db import models
from ...models import News, NewsComment, NewsCommentRating
from ..serializers import (
    NewsListSerializer,
    NewsDetailSerializer,
    NewsCommentCreateSerializer,
    NewsCommentUpdateSerializer,
    NewsCommentListSerializer,
    NewsCommentRatingListSerializer,
    NewsCommentRatingCreateSerializer,
    NewsCommentRatingUpdateSerializer,
)
from rest_framework import status
from core.responses import ResponseBuilder
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions


class NewsListView(APIView):
    permission_classes = [AllowAny]
    serializer_class = NewsListSerializer

    def get_queryset(self):
        return News.objects.filter(is_active=True).select_related("author", "category").prefetch_related("tag")

    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(
            queryset,
            many=True,
            context={"request": request},
        )
        return ResponseBuilder(
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()


class NewsRetriveView(APIView):
    permission_classes = [AllowAny]
    serializer_class = NewsDetailSerializer

    def get_queryset(self):
        return (
            News.objects.filter(is_active=True)
            .select_related("author", "category")
            .prefetch_related(
                "tag",
                Prefetch(
                    "comments",
                    queryset=NewsComment.objects.filter(parent__isnull=True)
                    .select_related("author")
                    .prefetch_related("ratings", "replies")
                    .annotate(
                        ratings_count=Count("ratings", distinct=True),
                        avg_rating=Avg("ratings__rating"),
                    ),
                ),
            )
            .annotate(comments_count=Count("comments", filter=models.Q(comments__parent__isnull=True)))
        )

    def get(self, request, news_slug):
        news = get_object_or_404(self.get_queryset(), slug=news_slug)
        serializer = self.serializer_class(news, context={"request": request})
        return ResponseBuilder(
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()


class NewsCommentListView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = NewsCommentListSerializer

    def news(self):
        return get_object_or_404(
            News.objects.active(),
            pk=self.kwargs["pk"],
        )

    def get_queryset(self):
        return (
            NewsComment.objects.active()
            .filter(news_id=self.kwargs["pk"])
            .select_related("author")
            .prefetch_related("ratings")
            .annotate(
                ratings_count=Count("ratings"),
                avg_rating=Avg("ratings__rating"),
            )
        )

    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            self.get_queryset(), many=True, context={"request": request}
        )
        return ResponseBuilder(
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()


class NewsCommentCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NewsCommentCreateSerializer

    def get_news(self):
        return get_object_or_404(
            News.objects.filter(is_active=True),
            pk=self.kwargs["pk"],
        )

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(
            author=request.user,
            news=self.get_news(),
        )
        return ResponseBuilder(
            data=serializer.data,
            status_code=status.HTTP_201_CREATED,
        ).standard()


class NewsCommentUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NewsCommentUpdateSerializer

    def get_object(self):
        return get_object_or_404(
            NewsComment.objects.filter(is_active=True),
            pk=self.kwargs["pk"],
        )

    def patch(self, request, *args, **kwargs):
        comment = self.get_object()

        if comment.author != request.user:
            return ResponseBuilder(
                data={"detail": "You are not allowed to edit this comment"},
                status_code=status.HTTP_403_FORBIDDEN,
            ).standard()

        serializer = self.serializer_class(
            comment,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return ResponseBuilder(
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()


class NewsCommentDestroyView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(
            NewsComment.objects.filter(is_active=True),
            pk=self.kwargs["pk"],
        )

    def delete(self, request, *args, **kwargs):
        comment = self.get_object()

        if comment.author != self.request.user:
            return ResponseBuilder(
                data={"detail": "You are not allowed to delete this comment"},
                status_code=status.HTTP_403_FORBIDDEN,
            ).standard()

        comment.delete()

        return ResponseBuilder(
            data={"detail": "Comment deleted permanently"},
            status_code=status.HTTP_204_NO_CONTENT,
        ).standard()


class CommentRatingMixin:
    def get_comment(self):
        if not hasattr(self, "_comment"):
            self._comment = get_object_or_404(
                NewsComment,
                id=self.kwargs["comment_id"],
                is_active=True,
            )
        return self._comment

    def get_queryset(self):
        return NewsCommentRating.objects.filter(
            comment=self.get_comment(),
            is_active=True,
        ).select_related("author")


class NewsCommentRatingListView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_classes = NewsCommentRatingListSerializer

    def get_comment(self):
        return get_object_or_404(
            NewsComment.objects.active(),
            pk=self.kwargs["comment_id"],
        )

    def get(self, request, *args, **kwagrs):
        ratings = NewsCommentRating.objects.filter(comment=self.get_comment())

        serializer = self.serializer_class(
            ratings, many=True, context={"request": request}
        )
        return ResponseBuilder(
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()


from django.db import IntegrityError


class NewsCommentRatingCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NewsCommentRatingCreateSerializer

    def get_comment(self):
        return get_object_or_404(
            NewsComment.objects.active(), pk=self.kwargs["comment_id"]
        )

    def post(self, request, *args, **kwargs):
        comment = self.get_comment()

        serializer = self.serializer_class(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        serializer.save(
            author=request.user,
            comment=comment,
        )

        return ResponseBuilder(
            data=serializer.data,
            status_code=status.HTTP_201_CREATED,
        ).standard()


class NewsCommentRatingUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NewsCommentRatingUpdateSerializer

    def patch(self, request, *args, **Kwargs):
        rating = get_object_or_404(
            NewsCommentRating.objects.active(),
            comment__pk=self.kwargs["comment_id"],
            author=request.user,
        )
        serializer = self.serializer_class(
            rating,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return ResponseBuilder(
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()


class NewsCommentRatingDestroyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        rating = get_object_or_404(
            NewsCommentRating.objects.active(),
            comment__pk=self.kwargs["comment_id"],
            author=request.user,
        )
        rating.delete()

        return ResponseBuilder(
            data={"detail": "Rating deleted successfully"},
            status_code=status.HTTP_204_NO_CONTENT,
        ).standard()



from ...models import Tag, Category
from ..serializers import TagSerializer, CategorySerializer


class TagListView(APIView):
    permission_classes = [AllowAny]
    serializer_class = TagSerializer

    def get_queryset(self):
        return Tag.objects.filter(is_active=True).annotate(
            news_count=Count("news", filter=models.Q(news__is_active=True))
        )

    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(
            queryset,
            many=True,
            context={"request": request},
        )
        return ResponseBuilder(
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()


class CategoryListView(APIView):
    permission_classes = [AllowAny]
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(is_active=True).annotate(
            news_count=Count("news", filter=models.Q(news__is_active=True))
        )

    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(
            queryset,
            many=True,
            context={"request": request},
        )
        return ResponseBuilder(
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()
