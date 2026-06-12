from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin
from ..models import Category


@admin.register(Category)
class CategoryAdmin(ImagePreviewMixin, StatusBadgeMixin, admin.ModelAdmin):
    list_display = ('poster_preview', 'title_en', 'slug', 'status_badge', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title_en', 'title_ru', 'title_az')
    prepopulated_fields = {'slug': ('title_en',)}
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Category Information', {
            'fields': ('title_en', 'title_ru', 'title_az', 'slug')
        }),
        ('Domain', {
            'fields': ('domain',)
        }),
        ('Media', {
            'fields': ('poster', 'logo')
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
        elif obj.logo:
            return self.get_image_preview(obj.logo.url, size=50, caption=obj.title_en)
        return format_html('<span style="color: #999;">No image</span>')
    poster_preview.short_description = 'Poster'
    
    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
