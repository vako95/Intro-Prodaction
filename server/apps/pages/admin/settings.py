from django.contrib import admin
from django.utils.html import format_html
from ..models import SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['site_name', 'maintenance_status']
    actions = ['toggle_maintenance_mode']
    
    fieldsets = (
        ("General Settings", {
            "fields": ("site_name", "site_title", "site_description", "site_keywords")
        }),
        ("Logos & Branding", {
            "fields": ("logo_light", "logo_dark", "favicon")
        }),
        ("Theme Colors", {
            "fields": ("primary_color", "secondary_color", "accent_color")
        }),
        ("Features Toggle", {
            "fields": (
                "enable_splash_screen",
                "enable_custom_cursor",
                "enable_newsletter",
                "enable_chat",
                "enable_booking",
                "enable_reviews",
                "enable_wishlist",
            )
        }),
        ("Booking Settings", {
            "fields": (
                "min_booking_days",
                "max_booking_days",
                "advance_booking_days",
                "cancellation_hours",
            )
        }),
        ("Payment Settings", {
            "fields": ("currency", "tax_rate", "service_fee")
        }),
        ("Contact Settings", {
            "fields": ("support_email", "support_phone", "whatsapp_number")
        }),
        ("Social Media", {
            "fields": (
                "facebook_url",
                "instagram_url",
                "twitter_url",
                "linkedin_url",
                "youtube_url",
                "tiktok_url",
            )
        }),
        ("Analytics & Tracking", {
            "fields": (
                "google_analytics_id",
                "facebook_pixel_id",
                "google_tag_manager_id",
            )
        }),
        ("Maintenance Mode", {
            "fields": (
                "maintenance_mode",
                "maintenance_message_en",
                "maintenance_message_ru",
                "maintenance_message_az",
                "maintenance_description_en",
                "maintenance_description_ru",
                "maintenance_description_az",
                "maintenance_end_time"
            )
        }),
        ("Performance Settings", {
            "fields": (
                "enable_caching",
                "cache_timeout",
                "enable_image_optimization",
            )
        }),
        ("Notification Settings", {
            "fields": (
                "enable_email_notifications",
                "enable_sms_notifications",
                "enable_push_notifications",
            )
        }),
        ("Legal & Compliance", {
            "fields": (
                "terms_url",
                "privacy_url",
                "cookie_policy_url",
                "enable_cookie_consent",
            )
        }),
        ("Custom Scripts", {
            "fields": ("header_scripts", "footer_scripts"),
            "classes": ("collapse",),
        }),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def maintenance_status(self, obj):
        if obj.maintenance_mode:
            return format_html(
                '<span style="color: red; font-weight: bold;">🔴 Active</span>'
            )
        return format_html(
            '<span style="color: green; font-weight: bold;">🟢 Disabled</span>'
        )
    maintenance_status.short_description = 'Maintenance Mode'

    def toggle_maintenance_mode(self, request, queryset):
        for settings in queryset:
            settings.maintenance_mode = not settings.maintenance_mode
            settings.save()
            status = 'enabled' if settings.maintenance_mode else 'disabled'
            self.message_user(request, f'Maintenance mode {status}')
    toggle_maintenance_mode.short_description = 'Toggle Maintenance Mode'
