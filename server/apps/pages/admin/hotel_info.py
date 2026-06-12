from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin, EmailMixin
from ..models import HotelInfo


@admin.register(HotelInfo)
class HotelInfoAdmin(ImagePreviewMixin, StatusBadgeMixin, EmailMixin, admin.ModelAdmin):
    """
    Admin for Hotel Information (Singleton)
    Only one instance should exist
    """

    def has_add_permission(self, request):
        """Prevent adding more than one instance"""
        if HotelInfo.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of the singleton instance"""
        return False

    fieldsets = (
        ('Basic Information', {
            'fields': ('hotel_name_en', 'hotel_name_ru', 'hotel_name_az', 'tagline_en', 'tagline_ru', 'tagline_az')
        }),
        ('About Section', {
            'fields': ('about_title_en', 'about_title_ru', 'about_title_az', 'about_description_en', 'about_description_ru', 'about_description_az', 'about_image')
        }),
        ('Contact Information', {
            'fields': ('phone_primary', 'phone_secondary', 'email_primary', 'email_support', 'address_en', 'address_ru', 'address_az', 'latitude', 'longitude')
        }),
        ('Social Media', {
            'fields': ('facebook_url', 'instagram_url', 'twitter_url', 'youtube_url', 'linkedin_url')
        }),
        ('Working Hours & Policies', {
            'fields': ('check_in_time', 'check_out_time', 'reception_hours')
        }),
        ('Footer', {
            'fields': ('footer_logo', 'footer_description_en', 'footer_description_ru', 'footer_description_az')
        }),
        ('SEO', {
            'fields': ('meta_title_en', 'meta_title_ru', 'meta_title_az', 'meta_description_en', 'meta_description_ru', 'meta_description_az'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )

    list_display = ('logo_preview', 'hotel_name_en', 'phone_display', 'email_display', 'has_coordinates', 'status_badge', 'updated_at')
    list_filter = ('is_active', 'created_at', 'updated_at')
    search_fields = ('hotel_name_en', 'hotel_name_ru', 'hotel_name_az', 'phone_primary', 'phone_secondary', 'email_primary', 'email_support', 'address_en', 'address_ru', 'address_az')
    readonly_fields = ('created_at', 'updated_at')
    
    def logo_preview(self, obj):
        """Circular logo preview"""
        if obj.footer_logo:
            return self.get_image_preview(obj.footer_logo.url, size=50, caption=obj.hotel_name_en)
        elif obj.about_image:
            return self.get_image_preview(obj.about_image.url, size=50, caption=obj.hotel_name_en)
        return format_html('<span style="color: #999;">No logo</span>')
    logo_preview.short_description = 'Logo'
    
    def phone_display(self, obj):
        """Phone with icon"""
        if obj.phone_primary:
            return format_html('<span style="color: #4CAF50;">📞 {}</span>', obj.phone_primary)
        return format_html('<span style="color: #999;">—</span>')
    phone_display.short_description = 'Phone'
    
    def email_display(self, obj):
        """Email with link"""
        return self.get_email_display(obj.email_primary)
    email_display.short_description = 'Email'
    
    def has_coordinates(self, obj):
        """Check if hotel has location coordinates"""
        return bool(obj.latitude and obj.longitude)
    has_coordinates.boolean = True
    has_coordinates.short_description = 'Has Location'
    
    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
