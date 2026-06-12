from django.contrib import admin
from django.utils.html import format_html
from ..models import News
from .mixins import AutoUserAdminMixin
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin


@admin.register(News)
class NewsAdmin(AutoUserAdminMixin, ImagePreviewMixin, StatusBadgeMixin):
    auto_user_field = "author"
    list_display = (
        "id",
        "poster_preview",
        "title_display",
        "category",
        "author",
        "is_active_display",
        "created_at",
    )
    list_filter = ("is_active", "category", "created_at")
    search_fields = ("title_en", "title_az", "title_ru", "slug")
    readonly_fields = ("slug", "created_at", "updated_at", "poster_display")
    ordering = ("-created_at",)
    list_display_links = ("id", "title_display")
    filter_horizontal = ("tag",)

    fieldsets = (
        ("Basic Information", {
            "fields": ("slug", "is_active", "category")
        }),
        ("Titles", {
            "fields": ("title_az", "title_en", "title_ru")
        }),
        ("Content", {
            "fields": ("content_az", "content_en", "content_ru")
        }),
        ("Media", {
            "fields": ("poster", "poster_display")
        }),
        ("Tags", {
            "fields": ("tag",),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )
    
    def poster_preview(self, obj):
        """Круглое превью постера"""
        if obj.poster:
            return self.get_image_preview(obj.poster.url, size=50, caption=obj.title_en)
        return self.get_image_preview(None)
    poster_preview.short_description = ""
    
    def poster_display(self, obj):
        """Полноразмерный постер"""
        if obj.poster:
            return self.get_image_detail(obj.poster.url, caption=obj.title_en, max_width=500)
        return self.get_image_detail(None)
    poster_display.short_description = "Poster"
    
    def title_display(self, obj):
        """Название новости"""
        title = obj.title_en or obj.title_az or obj.title_ru or "—"
        return format_html('<strong style="color: #1976D2;">{}</strong>', title)
    title_display.short_description = "Title"
    title_display.admin_order_field = "title_en"
    
    def is_active_display(self, obj):
        """Статус активности"""
        return self.get_boolean_badge(obj.is_active, 'Published', 'Draft')
    is_active_display.short_description = "Status"
    is_active_display.admin_order_field = "is_active"
