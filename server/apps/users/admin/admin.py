from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from ..models import User
from .mixins import ImagePreviewMixin, StatusBadgeMixin, EmailMixin


@admin.register(User)
class UserAdmin(BaseUserAdmin, ImagePreviewMixin, StatusBadgeMixin, EmailMixin):
    list_display = (
        "avatar_preview",
        "username",
        "email_display",
        "full_name_display",
        "is_staff",
        "is_email_verified_display",
        "date_joined",
    )
    list_filter = ("is_staff", "is_superuser", "is_active", "is_email_verified", "gender")
    search_fields = ("username", "email", "first_name", "last_name")
    readonly_fields = ("date_joined", "last_login", "avatar_display")
    
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {
            "fields": (
                "first_name",
                "last_name",
                "email",
                "gender",
                "date_of_birth",
                "avatar",
                "avatar_display",
            )
        }),
        ("Contact Information", {
            "fields": ("phone", "address", "city", "state", "postal_code", "country"),
            "classes": ("collapse",),
        }),
        ("Additional Information", {
            "fields": ("nationality", "passport_number", "emergency_contact_name", "emergency_contact_phone"),
            "classes": ("collapse",),
        }),
        ("Preferences", {
            "fields": ("preferred_language", "receive_newsletter", "receive_booking_notifications"),
            "classes": ("collapse",),
        }),
        ("Permissions", {
            "fields": ("is_active", "is_staff", "is_superuser", "is_email_verified", "groups", "user_permissions"),
        }),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "password1", "password2"),
        }),
    )
    
    def avatar_preview(self, obj):
        """Круглое превью аватара"""
        if obj.avatar:
            return self.get_image_preview(obj.avatar.url, size=50, caption=obj.username)
        return self.get_image_preview(None)
    avatar_preview.short_description = ""
    
    def avatar_display(self, obj):
        """Полноразмерный аватар"""
        if obj.avatar:
            return self.get_image_detail(obj.avatar.url, caption=obj.username, max_width=300)
        return self.get_image_detail(None)
    avatar_display.short_description = "Avatar"
    
    def email_display(self, obj):
        """Email с ссылкой"""
        return self.get_email_display(obj.email)
    email_display.short_description = "Email"
    email_display.admin_order_field = "email"
    
    def full_name_display(self, obj):
        """Полное имя"""
        full_name = f"{obj.first_name} {obj.last_name}".strip()
        if full_name:
            return full_name
        return "—"
    full_name_display.short_description = "Full Name"
    
    def is_email_verified_display(self, obj):
        """Статус верификации email"""
        return self.get_boolean_badge(obj.is_email_verified, '✓ Verified', '✗ Not Verified')
    is_email_verified_display.short_description = "Email Status"
    is_email_verified_display.admin_order_field = "is_email_verified"
