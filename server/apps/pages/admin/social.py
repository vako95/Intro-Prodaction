from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin
from ..models import Social


@admin.register(Social)
class SocialAdmin(ImagePreviewMixin, StatusBadgeMixin, admin.ModelAdmin):
    list_display = ('icon_preview', 'title_en', 'status_badge', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title_en', 'title_ru', 'title_az')
    readonly_fields = ('created_at', 'updated_at', 'slug')
    list_per_page = 20

    fieldsets = (
        ('Social Information', {
            'fields': ('title_en', 'title_ru', 'title_az', 'slug')
        }),
        ('Icon', {
            'fields': ('icon',)
        }),
        ('Settings', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def icon_preview(self, obj):
        """Icon display"""
        if obj.icon:
            return format_html('<span style="font-size: 24px;">{}</span>', obj.icon)
        return format_html('<span style="font-size: 24px; color: #999;">✨</span>')
    icon_preview.short_description = 'Icon'


    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
