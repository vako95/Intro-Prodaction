from django.contrib import admin
from django.utils.html import format_html
from ..models import PromotionalVideo
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin


@admin.register(PromotionalVideo)
class PromotionalVideoAdmin(admin.ModelAdmin, ImagePreviewMixin, StatusBadgeMixin):
    list_display = (
        "background_preview",
        "title_display",
        "youtube_id_display",
        "is_active_display",
        "order",
    )
    list_filter = ("is_active", "created_at")
    search_fields = ("title_en", "title_az", "title_ru", "subtitle_en")
    readonly_fields = ("created_at", "updated_at", "youtube_video_id", "background_display")
    
    fieldsets = (
        ("Titles", {
            "fields": ("title_en", "title_az", "title_ru")
        }),
        ("Subtitles", {
            "fields": ("subtitle_en", "subtitle_az", "subtitle_ru"),
            "classes": ("collapse",),
        }),
        ("Video Information", {
            "fields": ("youtube_url", "youtube_video_id", "background_image", "background_display")
        }),
        ("Settings", {
            "fields": ("is_active", "order")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )
    
    def background_preview(self, obj):
        """Превью фона"""
        if obj.background_image:
            return self.get_image_preview(obj.background_image.url, size=50)
        return self.get_image_preview(None)
    background_preview.short_description = ""
    
    def background_display(self, obj):
        """Полноразмерный фон"""
        if obj.background_image:
            return self.get_image_detail(obj.background_image.url, max_width=600)
        return self.get_image_detail(None)
    background_display.short_description = "Background Image"
    
    def title_display(self, obj):
        """Название"""
        title = obj.title_en or obj.title_az or obj.title_ru or "—"
        return format_html('<strong style="color: #1976D2;">{}</strong>', title)
    title_display.short_description = "Title"
    
    def youtube_id_display(self, obj):
        """YouTube ID"""
        if obj.youtube_video_id:
            return format_html(
                '<span style="font-family: monospace; background: #FFF3E0; color: #FF5722; '
                'padding: 4px 8px; border-radius: 4px;">{}</span>',
                obj.youtube_video_id
            )
        return '—'
    youtube_id_display.short_description = "YouTube ID"
    
    def is_active_display(self, obj):
        """Статус"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    is_active_display.short_description = "Status"
