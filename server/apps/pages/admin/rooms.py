from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin, PriceMixin
from ..models import Room, RoomIcon


class RoomsIconInline(admin.TabularInline):
    model = RoomIcon


@admin.register(Room)
class RoomAdmin(ImagePreviewMixin, StatusBadgeMixin, PriceMixin, admin.ModelAdmin):
    inlines = [RoomsIconInline]
    exclude = ('icons',)
    list_display = ('cover_preview', 'title_display', 'price_display', 'status_badge', 'created_at')
    list_filter = ('price', 'is_active', 'created_at', 'updated_at')
    search_fields = ('title',)
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 10

    fieldsets = (
        ('Room Information', {
            'fields': ('title',)
        }),
        ('Media', {
            'fields': ('cover',)
        }),
        ('Pricing', {
            'fields': ('price',)
        }),
        ('Settings', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def cover_preview(self, obj):
        """Circular cover preview"""
        if obj.cover:
            return self.get_image_preview(obj.cover.url, size=50, caption=obj.title)
        return format_html('<span style="color: #999;">No image</span>')
    cover_preview.short_description = 'Cover'

    def title_display(self, obj):
        """Title display"""
        title = obj.title if len(obj.title) <= 20 else obj.title[:20] + '...'
        return format_html('<strong style="color: #333;">{}</strong>', title)
    title_display.short_description = 'Title'

    def price_display(self, obj):
        """Formatted price"""
        return self.get_price_display(obj.price, currency='💰 ', color='#4CAF50')
    price_display.short_description = 'Price'
    
    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
