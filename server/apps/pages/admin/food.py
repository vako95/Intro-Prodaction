from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin, PriceMixin
from ..models import Food


@admin.register(Food)
class FoodAdmin(ImagePreviewMixin, StatusBadgeMixin, PriceMixin, admin.ModelAdmin):
    list_display = ('id','poster_preview', 'title_en', 'price_display', 'status_badge', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title_en', 'title_ru', 'title_az', 'description_en')
    filter_horizontal = ('tag',)
    prepopulated_fields = {'slug': ('title_en',)}
    readonly_fields = ('created_at', 'updated_at')
    list_display_links = ('id', 'title_en')
    fieldsets = (
        ('Titles', {
            'fields': ('title_en', 'title_ru', 'title_az', 'slug')
        }),
        ('Subtitles', {
            'fields': ('subtitle_en', 'subtitle_ru', 'subtitle_az')
        }),
        ('Descriptions', {
            'fields': ('description_en', 'description_ru', 'description_az')
        }),
        ('Pricing', {
            'fields': ('price',)
        }),
        ('Media', {
            'fields': ('poster',)
        }),
        ('Categorization', {
            'fields': ('tag',)
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
    
    def price_display(self, obj):
        """Formatted price"""
        return self.get_price_display(obj.price, currency='$', color='#4CAF50')
    price_display.short_description = 'Price'
    
    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
