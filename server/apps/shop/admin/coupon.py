from django.contrib import admin
from django.utils.html import format_html
from ..models import Coupon
from apps.users.admin.mixins import StatusBadgeMixin, PriceMixin


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin, StatusBadgeMixin, PriceMixin):
    list_display = (
        "code_display",
        "discount_display",
        "validity_display",
        "usage_display",
        "is_active_display",
    )
    list_filter = ("coupon_type", "is_active", "valid_from", "valid_to")
    search_fields = ("code", "description")
    readonly_fields = ("id", "usage_count", "created_at", "updated_at")
    filter_horizontal = ("rooms",)
    ordering = ("-created_at",)
    
    fieldsets = (
        ("Basic Information", {
            "fields": ("id", "code", "coupon_type", "discount_value", "is_active")
        }),
        ("Validity", {
            "fields": ("valid_from", "valid_to")
        }),
        ("Limits", {
            "fields": ("min_order_amount", "max_discount_amount", "usage_limit", "usage_count", "user_usage_limit")
        }),
        ("Applicable Rooms", {
            "fields": ("rooms",),
            "classes": ("collapse",),
        }),
        ("Additional Info", {
            "fields": ("description",),
            "classes": ("collapse",),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )
    
    def code_display(self, obj):
        return format_html(
            '<span style="font-family: monospace; font-weight: 700; color: #FF5722; '
            'background: #FFF3E0; padding: 4px 8px; border-radius: 4px;">{}</span>',
            obj.code
        )
    code_display.short_description = "Code"
    code_display.admin_order_field = "code"
    
    def discount_display(self, obj):
        """Скидка"""
        if obj.coupon_type == 'percentage':
            return format_html(
                '<span style="color: #4CAF50; font-weight: 600;">{}%</span>',
                obj.discount_value
            )
        return self.get_price_display(obj.discount_value)
    discount_display.short_description = "Discount"
    discount_display.admin_order_field = "discount_value"
    
    def validity_display(self, obj):
        """Срок действия"""
        return format_html(
            '<span style="color: #666; font-size: 12px;">{} → {}</span>',
            obj.valid_from.strftime('%d.%m.%Y'),
            obj.valid_to.strftime('%d.%m.%Y')
        )
    validity_display.short_description = "Valid Period"
    
    def usage_display(self, obj):
        if obj.usage_limit:
            percentage = (obj.usage_count / obj.usage_limit) * 100
            color = '#4CAF50' if percentage < 80 else '#FF9800' if percentage < 100 else '#F44336'
            return format_html(
                '<span style="color: {}; font-weight: 600;">{} / {}</span>',
                color, obj.usage_count, obj.usage_limit
            )
        return format_html('<span style="color: #666;">{} / ∞</span>', obj.usage_count)
    usage_display.short_description = "Usage"
    
    def is_active_display(self, obj):
        
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    is_active_display.short_description = "Status"
    is_active_display.admin_order_field = "is_active"
