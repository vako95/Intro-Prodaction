from django.contrib import admin
from django.utils.html import format_html
from ..models import Payment
from apps.users.admin.mixins import StatusBadgeMixin, PriceMixin


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin, StatusBadgeMixin, PriceMixin):
    list_display = (
        "id",
        "order",
        "user",
        "amount_display",
        "payment_method_display",
        "status_display",
        "payment_date",
    )
    list_filter = ("status", "payment_method", "payment_date", "created_at")
    search_fields = ("order__order_number", "user__username", "user__email", "transaction_id")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("-created_at",)
    
    fieldsets = (
        ("Basic Information", {
            "fields": ("id", "order", "user", "amount", "status")
        }),
        ("Payment Details", {
            "fields": ("payment_method", "payment_gateway", "transaction_id", "payment_date")
        }),
        ("Refund Information", {
            "fields": ("refund_amount", "refund_date"),
            "classes": ("collapse",),
        }),
        ("Additional Info", {
            "fields": ("notes", "metadata"),
            "classes": ("collapse",),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )
    
    def amount_display(self, obj):
        """Сумма платежа"""
        return self.get_price_display(obj.amount)
    amount_display.short_description = "Amount"
    amount_display.admin_order_field = "amount"
    
    def payment_method_display(self, obj):
        """Метод оплаты"""
        icons = {
            'cash': '💵',
            'card': '💳',
            'bank_transfer': '🏦',
            'paypal': '🅿️',
            'stripe': '💳',
        }
        icon = icons.get(obj.payment_method, '💰')
        return format_html(
            '<span style="color: #666;">{} {}</span>',
            icon, obj.get_payment_method_display()
        )
    payment_method_display.short_description = "Method"
    payment_method_display.admin_order_field = "payment_method"
    
    def status_display(self, obj):
        """Статус платежа"""
        return self.get_status_badge(obj.status)
    status_display.short_description = "Status"
    status_display.admin_order_field = "status"
