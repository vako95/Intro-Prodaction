from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin
from ..models import PromoSection


@admin.register(PromoSection)
class PromoSectionAdmin(ImagePreviewMixin, StatusBadgeMixin, admin.ModelAdmin):
    list_display = ('media_preview', 'title_en', 'section_type', 'order', 'featured_badge', 'status_badge', 'created_at')
    list_filter = ('section_type', 'is_active', 'is_featured', 'created_at')
    search_fields = ('title_en', 'title_ru', 'title_az', 'description_en')
    list_editable = ('order',)
    prepopulated_fields = {'slug': ('title_en',)}
    ordering = ('order', '-created_at')

    fieldsets = (
        ('Section Information', {
            'fields': ('section_type', 'title_en', 'title_ru', 'title_az', 'slug')
        }),
        ('Subtitle', {
            'fields': ('subtitle_en', 'subtitle_ru', 'subtitle_az')
        }),
        ('Description', {
            'fields': ('description_en', 'description_ru', 'description_az')
        }),
        ('Video Settings', {
            'fields': ('video_url', 'video_thumbnail'),
            'description': 'For video type sections',
            'classes': ('collapse',)
        }),
        ('Image Settings', {
            'fields': ('background_image',),
            'description': 'For banner/CTA type sections',
            'classes': ('collapse',)
        }),
        ('Call to Action', {
            'fields': ('button_text_en', 'button_text_ru', 'button_text_az', 'button_url'),
            'classes': ('collapse',)
        }),
        ('Display Settings', {
            'fields': ('order', 'is_featured', 'is_active')
        }),
    )
    
    def media_preview(self, obj):
        """Preview of video thumbnail or background image"""
        if obj.video_thumbnail:
            return self.get_image_preview(obj.video_thumbnail.url, size=50, caption=f'{obj.title_en} (Video)')
        elif obj.background_image:
            return self.get_image_preview(obj.background_image.url, size=50, caption=f'{obj.title_en} (Image)')
        return format_html('<span style="color: #999;">No media</span>')
    media_preview.short_description = 'Media'
    
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
