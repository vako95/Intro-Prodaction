from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin
from ..models import SpecialOffer


@admin.register(SpecialOffer)
class SpecialOfferAdmin(ImagePreviewMixin, StatusBadgeMixin, admin.ModelAdmin):
    list_display = ('image_preview', 'title_en', 'offer_type', 'discount_display', 'validity_period', 'featured_badge', 'status_badge')
    list_filter = ('is_active', 'is_featured', 'offer_type', 'valid_from', 'valid_to', 'created_at')
    search_fields = ('title_en', 'title_ru', 'title_az', 'description_en')
    prepopulated_fields = {'slug': ('title_en',)}
    filter_horizontal = ('rooms',)
    ordering = ('-is_featured', 'order', '-created_at')
    date_hierarchy = 'valid_from'

    fieldsets = (
        ('Offer Information', {
            'fields': ('title_en', 'title_ru', 'title_az', 'slug', 'offer_type')
        }),
        ('Subtitle', {
            'fields': ('subtitle_en', 'subtitle_ru', 'subtitle_az')
        }),
        ('Description', {
            'fields': ('description_en', 'description_ru', 'description_az')
        }),
        ('Discount & Validity', {
            'fields': ('discount_percentage', 'valid_from', 'valid_to')
        }),
        ('Image', {
            'fields': ('image',)
        }),
        ('Applicable Rooms', {
            'fields': ('rooms',),
            'description': 'Leave empty to apply to all rooms'
        }),
        ('Terms & Conditions', {
            'fields': ('terms_conditions_en', 'terms_conditions_ru', 'terms_conditions_az'),
            'classes': ('collapse',)
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

    def discount_display(self, obj):
        """Discount badge"""
        return format_html(
            '<span style="'
            'background: #FF5722; '
            'color: white; '
            'padding: 4px 12px; '
            'border-radius: 12px; '
            'font-weight: 600; '
            'font-size: 12px;'
            '">-{}%</span>',
            obj.discount_percentage
        )
    discount_display.short_description = 'Discount'

    def validity_period(self, obj):
        """Validity period display"""
        return format_html(
            '<span style="color: #666; font-size: 12px;">{} - {}</span>',
            obj.valid_from.strftime('%Y-%m-%d'),
            obj.valid_to.strftime('%Y-%m-%d')
        )
    validity_period.short_description = 'Validity Period'
    
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
        """Status with days remaining"""
        if obj.is_valid():
            days = obj.days_remaining()
            color = '#4CAF50' if days > 7 else '#FF9800'
            return format_html(
                '<span style="'
                'background: {}; '
                'color: white; '
                'padding: 4px 12px; '
                'border-radius: 12px; '
                'font-weight: 600; '
                'font-size: 11px;'
                '">✓ Active ({} days)</span>',
                color, days
            )
        return format_html(
            '<span style="'
            'background: #F44336; '
            'color: white; '
            'padding: 4px 12px; '
            'border-radius: 12px; '
            'font-weight: 600; '
            'font-size: 11px;'
            '">✗ Expired</span>'
        )
    status_badge.short_description = 'Status'
