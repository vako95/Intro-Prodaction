from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin
from ..models import HeroSlider


@admin.register(HeroSlider)
class HeroSliderAdmin(ImagePreviewMixin, StatusBadgeMixin, admin.ModelAdmin):
    list_display = ("id",'poster_preview', 'title_en', 'status_badge', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title_en', 'title_ru', 'title_az', 'subtitle_en')
    readonly_fields = ('created_at', 'updated_at')
    list_display_links = ('id', 'title_en')
    fieldsets = (
        ('Titles', {
            'fields': ('title_en', 'title_ru', 'title_az')
        }),
        ('Subtitles', {
            'fields': ('subtitle_en', 'subtitle_ru', 'subtitle_az')
        }),
        ('Descriptions', {
            'fields': ('description_en', 'description_ru', 'description_az')
        }),
        ('Media', {
            'fields': ('poster',)
        }),
        ('Brand', {
            'fields': ('brand',)
        }),
        ('Settings', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def poster_preview(self, obj):
        """Circular poster preview"""
        if obj.poster:
            return self.get_image_preview(obj.poster.url, size=50, caption=obj.title_en)
        return format_html('<span style="color: #999;">No image</span>')
    poster_preview.short_description = 'Poster'
    
    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
