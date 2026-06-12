from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin
from ..models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(ImagePreviewMixin, StatusBadgeMixin, admin.ModelAdmin):
    list_display = ('image_preview', 'name_en', 'role_en', 'rating_display', 'status_badge', 'order', 'created_at')
    list_filter = ('is_active', 'rating', 'created_at')
    search_fields = ('name_en', 'name_az', 'name_ru', 'comment_en')
    list_editable = ('order',)
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('Names', {
            'fields': ('name_en', 'name_az', 'name_ru')
        }),
        ('Roles', {
            'fields': ('role_en', 'role_az', 'role_ru')
        }),
        ('Comments', {
            'fields': ('comment_en', 'comment_az', 'comment_ru')
        }),
        ('Media & Rating', {
            'fields': ('image', 'rating')
        }),
        ('Settings', {
            'fields': ('is_active', 'order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        """Circular image preview"""
        if obj.image:
            return self.get_image_preview(obj.image.url, size=50, caption=obj.name_en)
        return format_html('<span style="color: #999;">No image</span>')
    image_preview.short_description = 'Photo'
    
    def rating_display(self, obj):
        """Star rating display"""
        stars = '⭐' * int(obj.rating)
        return format_html(
            '<span style="color: #FF9800; font-size: 14px;">{}</span> '
            '<span style="color: #666; font-size: 12px;">({}/5)</span>',
            stars, obj.rating
        )
    rating_display.short_description = 'Rating'
    
    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
