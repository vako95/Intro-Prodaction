from django.contrib import admin
from django.utils.html import format_html
from ..models import Wishlist
from apps.users.admin.mixins import ImagePreviewMixin


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin, ImagePreviewMixin):
    list_display = ("room_preview", "user", "room_title", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__username", "user__email", "room__title_en")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("-created_at",)
    
    fieldsets = (
        ("Basic Information", {
            "fields": ("id", "user", "room")
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
