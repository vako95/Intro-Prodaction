from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin
from ..models import AdvantagesBar


@admin.register(AdvantagesBar)
class AdvantagesBarAdmin(ImagePreviewMixin, StatusBadgeMixin, admin.ModelAdmin):
    list_display = ("id",'icon_preview', 'title_en', 'status_badge', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title_en', 'title_ru', 'title_az', 'description_en')
    readonly_fields = ('created_at', 'updated_at')
    list_display_links = ('id', 'title_en')
    fieldsets = (
        ('Titles', {
            'fields': ('title_en', 'title_ru', 'title_az')
        }),
        ('Descriptions', {
            'fields': ('description_en', 'description_ru', 'description_az')
        }),
        ('Icon', {
            'fields': ('icon', 'logo_svg')
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
        """Circular icon preview"""
        if obj.icon:
            return self.get_image_preview(obj.icon.url, size=50, caption=obj.title_en)
        return format_html('<span style="color: #999;">No icon</span>')
    icon_preview.short_description = 'Icon'
    
    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
