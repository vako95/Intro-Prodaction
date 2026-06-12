"""
Admin interface for Contact Information
Focused view of HotelInfo for managing contact details
"""
from django.contrib import admin
from django.utils.html import format_html

from ..models import ContactInfo


@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    """
    Simplified admin interface focused on contact information
    """

    def has_add_permission(self, request):
        """Prevent adding more than one instance (shared with HotelInfo)"""
        from ..models import HotelInfo
        if HotelInfo.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        """Prevent deletion"""
        return False

    fieldsets = (
        (
            "📞 Phone Numbers",
            {
                "fields": (
                    "phone_primary",
                    "phone_secondary",
                ),
                "description": "Primary and secondary contact phone numbers"
            },
        ),
        (
            "📧 Email Addresses",
            {
                "fields": (
                    "email_primary",
                    "email_support",
                ),
                "description": "Primary and support email addresses"
            },
        ),
        (
            "📍 Address",
            {
                "fields": (
                    "address_en",
                    "address_ru",
                    "address_az",
                ),
                "description": "Hotel address in multiple languages"
            },
        ),
        (
            "🗺️ Location Coordinates",
            {
                "fields": (
                    "latitude",
                    "longitude",
                ),
                "description": "GPS coordinates for map integration"
            },
        ),
        (
            "🌐 Social Media",
            {
                "fields": (
                    "facebook_url",
                    "instagram_url",
                    "twitter_url",
                    "youtube_url",
                    "linkedin_url",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "🕐 Working Hours",
            {
                "fields": (
                    "check_in_time",
                    "check_out_time",
                    "reception_hours",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Status",
            {
                "fields": ("is_active",)
            },
        ),
    )

    list_display = (
        "hotel_name_display",
        "phone_display",
        "email_display",
        "has_coordinates",
        "is_active_badge",
        "updated_at"
    )
    
    list_filter = ("is_active", "updated_at")
    
    search_fields = (
        "hotel_name_en",
        "phone_primary",
        "phone_secondary",
        "email_primary",
        "email_support",
        "address_en",
        "address_ru",
        "address_az"
    )
    
    readonly_fields = ("created_at", "updated_at")
    
    def hotel_name_display(self, obj):
        """Display hotel name"""
        return obj.hotel_name_en
    hotel_name_display.short_description = "Hotel Name"
    
    def phone_display(self, obj):
        """Display primary phone with icon"""
        if obj.phone_primary:
            return format_html(
                '<span style="color: #28a745;">📞 {}</span>',
                obj.phone_primary
            )
        return format_html('<span style="color: #dc3545;">❌ Not set</span>')
    phone_display.short_description = "Primary Phone"
    
    def email_display(self, obj):
        """Display primary email with icon"""
        if obj.email_primary:
            return format_html(
                '<span style="color: #007bff;">📧 {}</span>',
                obj.email_primary
            )
        return format_html('<span style="color: #dc3545;">❌ Not set</span>')
    email_display.short_description = "Primary Email"
    
    def has_coordinates(self, obj):
        """Check if location coordinates are set"""
        return bool(obj.latitude and obj.longitude)
    has_coordinates.boolean = True
    has_coordinates.short_description = "📍 Has Location"
    
    def is_active_badge(self, obj):
        """Display active status with badge"""
        if obj.is_active:
            return format_html(
                '<span style="background-color: #28a745; color: white; padding: 3px 10px; border-radius: 3px;">✓ Active</span>'
            )
        return format_html(
            '<span style="background-color: #dc3545; color: white; padding: 3px 10px; border-radius: 3px;">✗ Inactive</span>'
        )
    is_active_badge.short_description = "Status"
