from django.contrib import admin
from django.utils.html import format_html
from ..models import Order, OrderItem, OrderStatusHistory
from apps.users.admin.mixins import StatusBadgeMixin, PriceMixin, LinkMixin


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("subtotal",)
    fields = ("room", "check_in", "check_out", "rooms_count", "adults", "children", "nights", "price_per_night", "subtotal")


class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    readonly_fields = ("created_at", "changed_by")
    fields = ("old_status", "new_status", "changed_by", "reason", "created_at")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin, StatusBadgeMixin, PriceMixin, LinkMixin):
    list_display = (
        "order_number_display",
        "user",
        "status_display",
        "payment_status_display",
        "total_amount_display",
        "final_amount_display",
        "created_at",
    )
    list_filter = ("status", "payment_status", "created_at")
    search_fields = ("order_number", "user__username", "user__email")
    readonly_fields = ("order_number", "created_at", "updated_at", "discount_amount", "final_amount")
    autocomplete_fields = ("user", "coupon")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    inlines = [OrderItemInline, OrderStatusHistoryInline]
    
    fieldsets = (
        ("Order Information", {
            "fields": ("order_number", "user", "status", "payment_status")
        }),
        ("Amounts", {
            "fields": ("total_amount", "coupon", "discount_amount", "final_amount")
        }),
        ("Notes", {
            "fields": ("notes",),
            "classes": ("collapse",),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )
    
    def order_number_display(self, obj):
        """Номер заказа"""
        return format_html(
            '<span style="font-family: monospace; font-weight: 600; color: #1976D2;">#{}</span>',
            obj.order_number
        )
    order_number_display.short_description = "Order #"
    order_number_display.admin_order_field = "order_number"
    
    def status_display(self, obj):
        """Статус заказа"""
        return self.get_status_badge(obj.status)
    status_display.short_description = "Status"
    status_display.admin_order_field = "status"
    
    def payment_status_display(self, obj):
        """Статус оплаты"""
        return self.get_status_badge(obj.payment_status)
    payment_status_display.short_description = "Payment"
    payment_status_display.admin_order_field = "payment_status"
    
    def total_amount_display(self, obj):
        """Общая сумма"""
        return self.get_price_display(obj.total_amount)
    total_amount_display.short_description = "Total"
    total_amount_display.admin_order_field = "total_amount"
    
    def final_amount_display(self, obj):
        """Финальная сумма"""
        if obj.discount_amount > 0:
            return format_html(
                '{}<br><small style="color: #999;">-${} discount</small>',
                self.get_price_display(obj.final_amount, color='#2196F3'),
                obj.discount_amount
            )
        return self.get_price_display(obj.final_amount, color='#2196F3')
    final_amount_display.short_description = "Final"
    final_amount_display.admin_order_field = "final_amount"


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin, PriceMixin):
    list_display = ("id", "order", "room", "check_in", "check_out", "rooms_count", "nights", "subtotal_display")
    list_filter = ("check_in", "check_out", "created_at")
    search_fields = ("order__order_number", "room__title_en")
    readonly_fields = ("created_at", "updated_at")
    autocomplete_fields = ("order", "room")
    ordering = ("-created_at",)
    
    def subtotal_display(self, obj):
        """Подытог"""
        return self.get_price_display(obj.subtotal)
    subtotal_display.short_description = "Subtotal"
    subtotal_display.admin_order_field = "subtotal"


@admin.register(OrderStatusHistory)
class OrderStatusHistoryAdmin(admin.ModelAdmin, StatusBadgeMixin):
    list_display = ("id", "order", "status_change_display", "changed_by", "created_at")
    list_filter = ("old_status", "new_status", "created_at")
    search_fields = ("order__order_number", "reason")
    readonly_fields = ("created_at",)
    autocomplete_fields = ("order", "changed_by")
    ordering = ("-created_at",)
    
    def status_change_display(self, obj):
        """Изменение статуса"""
        return format_html(
            '{} <span style="color: #999;">→</span> {}',
            self.get_status_badge(obj.old_status),
            self.get_status_badge(obj.new_status)
        )
    status_change_display.short_description = "Status Change"
