from django.urls import path
from .views import (
    NewsListView,
    NewsRetriveView,
    NewsCommentCreateView,
    NewsCommentUpdateView,
    NewsCommentDestroyView,
    NewsCommentRatingListView,
    NewsCommentRatingCreateView,
    NewsCommentRatingUpdateView,
    NewsCommentRatingDestroyView,
    LatestNewsFeedView,
    TagListView,
    CategoryListView,
)

urlpatterns = [
    path("news/", NewsListView.as_view(), name="news-list"),
    path("news/latest/", LatestNewsFeedView.as_view(), name="latest-news-feed"),
    path("news/<slug:news_slug>/", NewsRetriveView.as_view(), name="news-retrieve"),
    path("news/<int:pk>/comments/", NewsCommentCreateView.as_view()),
    path(
        "news/comments/<int:pk>/",
        NewsCommentUpdateView.as_view(),
    ),
    path(
        "news/comments/<int:pk>/delete/",
        NewsCommentDestroyView.as_view(),
        name="news-comment-destroy",
    ),
    path("tags/", TagListView.as_view(), name="tag-list"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
]
