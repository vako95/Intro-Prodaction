from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin
from apps.pages.models import Quote


@admin.register(Quote)
class QuoteAdmin(ImagePreviewMixin, StatusBadgeMixin, admin.ModelAdmin):
    list_display = ['image_preview', 'name', 'position', 'verified_badge', 'order', 'status_badge', 'created_at']
    list_filter = ['is_active', 'is_verified', 'created_at']
    search_fields = ['name', 'name_en', 'name_az', 'name_ru', 'position', 'quote']
    list_editable = ['order']
    ordering = ['order', '-created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'name_az', 'name_en', 'name_ru')
        }),
        ('Position/Role', {
            'fields': ('position', 'position_az', 'position_en', 'position_ru')
        }),
        ('Quote Text', {
            'fields': ('quote', 'quote_az', 'quote_en', 'quote_ru')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Settings', {
            'fields': ('is_verified', 'order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        """Circular image preview"""
        if obj.image:
            return self.get_image_preview(obj.image.url, size=50, caption=obj.name)
        return format_html('<span style="color: #999;">No image</span>')
    image_preview.short_description = 'Photo'
    
    def verified_badge(self, obj):
        """Verified badge"""
        if obj.is_verified:
            return format_html(
                '<span style="'
                'background: #2196F3; '
                'color: white; '
                'padding: 3px 10px; '
                'border-radius: 12px; '
                'font-weight: 600; '
                'font-size: 11px;'
                '">✓ Verified</span>'
            )
        return format_html('<span style="color: #999;">—</span>')
    verified_badge.short_description = 'Verified'
    
    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
