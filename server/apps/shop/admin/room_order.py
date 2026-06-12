from django.contrib import admin
from django.utils.html import format_html
from ..models import RoomOrder
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin


@admin.register(RoomOrder)
class RoomOrderAdmin(admin.ModelAdmin, ImagePreviewMixin, StatusBadgeMixin):
    list_display = (
        "room_preview",
        "user",
        "room_title",
        "dates_display",
        "guests_display",
        "rooms_reserved",
        "status_display",
    )
    list_filter = ("status", "check_in", "check_out", "created_at")
    search_fields = ("user__username", "user__email", "room__title_en")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("-created_at",)
    
    fieldsets = (
        ("Basic Information", {
            "fields": ("id", "room", "user", "status")
        }),
        ("Dates", {
            "fields": ("check_in", "check_out")
        }),
        ("Guests", {
            "fields": ("adults", "children", "rooms_reserved")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )
    
    def room_preview(self, obj):
        """Превью комнаты"""
        if obj.room and obj.room.poster:
            return self.get_image_preview(obj.room.poster.url, size=50, caption=obj.room.title_en)
        return self.get_image_preview(None)
    room_preview.short_description = ""
    
    def room_title(self, obj):
        """Название комнаты"""
        if obj.room:
            return format_html('<strong style="color: #1976D2;">{}</strong>', obj.room.title_en or '—')
        return '—'
    room_title.short_description = "Room"
    
    def dates_display(self, obj):
        """Даты"""
        return format_html(
            '<span style="color: #666;">📅 {} → {}</span>',
            obj.check_in.strftime('%d.%m.%Y'),
            obj.check_out.strftime('%d.%m.%Y')
        )
    dates_display.short_description = "Dates"
    
    def guests_display(self, obj):
        """Гости"""
        return format_html(
            '<span style="color: #666;">👤 {} | 👶 {}</span>',
            obj.adults, obj.children
        )
    guests_display.short_description = "Guests"
    
    def status_display(self, obj):
        """Статус"""
        return self.get_status_badge(obj.status)
    status_display.short_description = "Status"
    status_display.admin_order_field = "status"
