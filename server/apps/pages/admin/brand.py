from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin
from ..models import Brand


@admin.register(Brand)
class BrandAdmin(ImagePreviewMixin, StatusBadgeMixin, admin.ModelAdmin):
    list_display = ('logo_preview', 'name_en', 'slug', 'status_badge', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name_en', 'name_ru', 'name_az', 'slug')
    prepopulated_fields = {'slug': ('name_en',)}
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Brand Information', {
            'fields': ('name_en', 'name_ru', 'name_az', 'slug')
        }),
        ('Logo', {
            'fields': ('logo', 'logo_svg')
        }),
        ('Settings', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def logo_preview(self, obj):
        """Circular logo preview"""
        if obj.logo:
            return self.get_image_preview(obj.logo.url, size=50, caption=obj.name_en)
        return format_html('<span style="color: #999;">No logo</span>')
    logo_preview.short_description = 'Logo'
    
    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
