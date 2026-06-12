from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("apps.pages.api.urls")),
    path("api/v2/shop/", include("apps.shop.api.urls")),
    path("api/v2/blog/", include("apps.blog.api.urls")),
    path("api/v2/users/", include("apps.users.api.urls")),
    path("ckeditor/", include("ckeditor_uploader.urls")),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
