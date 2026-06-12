from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin
from ..models import HotelGallery, GalleryCategory


@admin.register(GalleryCategory)
class GalleryCategoryAdmin(StatusBadgeMixin, admin.ModelAdmin):
    list_display = ('id','name_en', 'slug', 'order', 'status_badge', 'image_count', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name_en', 'name_ru', 'name_az', 'description_en')
    list_editable = ('order',)
    prepopulated_fields = {'slug': ('name_en',)}
    ordering = ('order', 'name_en')
    list_display_links = ('id', 'name_en','created_at')
    fieldsets = (
        ('Category Information', {
            'fields': ('name_en', 'name_ru', 'name_az', 'slug')
        }),
        ('Description', {
            'fields': ('description_en', 'description_ru', 'description_az')
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
    )
    
    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
    
    def image_count(self, obj):
        """Count of images in category"""
        count = obj.images.count()
        return format_html(
            '<span style="'
            'background: #2196F3; '
            'color: white; '
            'padding: 3px 10px; '
            'border-radius: 12px; '
            'font-weight: 600; '
            'font-size: 11px;'
            '">{} images</span>',
            count
        )
    image_count.short_description = 'Images'


@admin.register(HotelGallery)
class HotelGalleryAdmin(ImagePreviewMixin, StatusBadgeMixin, admin.ModelAdmin):
    list_display = ('image_preview', 'title_en', 'category', 'order', 'featured_badge', 'status_badge', 'created_at')
    list_display_links = ('image_preview', 'title_en', 'created_at')
    list_filter = ('is_active', 'is_featured', 'category', 'created_at')
    search_fields = ('title_en', 'title_ru', 'title_az', 'description_en')
    list_editable = ('order',)
    autocomplete_fields = ('category',)
    ordering = ('category', 'order', '-created_at')
    
    fieldsets = (
        ('Image Information', {
            'fields': ('title_en', 'title_ru', 'title_az')
        }),
        ('Description', {
            'fields': ('description_en', 'description_ru', 'description_az')
        }),
        ('Images', {
            'fields': ('image', 'thumbnail')
        }),
        ('Categorization', {
            'fields': ('category',)
        }),
        ('Display Settings', {
            'fields': ('order', 'is_featured', 'is_active')
        }),
    )
    
    def image_preview(self, obj):
        """Circular image preview"""
        if obj.image:
            return self.get_image_preview(obj.image.url, size=50, caption=obj.title_en)
        return format_html('<span style="color: #999;">No image</span>')
    image_preview.short_description = 'Image'
    
    def featured_badge(self, obj):
        """Featured badge"""
        if obj.is_featured:
            return format_html(
                '<span style="'
                'background: #FF9800; '
                'color: white; '
                'padding: 3px 10px; '
                'border-radius: 12px; '
                'font-weight: 600; '
                'font-size: 11px;'
                '">⭐ Featured</span>'
            )
        return format_html('<span style="color: #999;">—</span>')
    featured_badge.short_description = 'Featured'
    
    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
