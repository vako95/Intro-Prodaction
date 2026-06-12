from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from ..models import Tag
from apps.users.admin.mixins import StatusBadgeMixin


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin, StatusBadgeMixin):
    list_display = (
        "id",
        "name_display",
        "slug",
        "news_count_display",
        "is_active_display",
        "created_at",
    )
    list_filter = ("is_active", "created_at")
    search_fields = ("name_en", "name_az", "name_ru", "slug")
    readonly_fields = ("slug", "created_at", "updated_at")
    ordering = ("-created_at",)
    list_display_links = ("id", "name_display")

    fieldsets = (
        ("Basic Information", {
            "fields": ("slug", "is_active")
        }),
        ("Names", {
            "fields": ("name_az", "name_en", "name_ru")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            news_count=Count("news", distinct=True)
        )
    
    def name_display(self, obj):
        name = obj.name_en or obj.name_az or obj.name_ru or "—"
        return format_html('<strong style="color: #2E7D32;">{}</strong>', name)
    name_display.short_description = "Name"
    name_display.admin_order_field = "name_en"
    
    def news_count_display(self, obj):
        count = getattr(obj, "news_count", 0)
        if count > 0:
            return format_html(
                '<span style="background: #4CAF50; color: white; padding: 2px 8px; border-radius: 12px; font-weight: bold;">{}</span>',
                count
            )
        return format_html(
            '<span style="background: #E0E0E0; color: #757575; padding: 2px 8px; border-radius: 12px;">0</span>'
        )
    news_count_display.short_description = "News Count"
    news_count_display.admin_order_field = "news_count"
    
    def is_active_display(self, obj):
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    is_active_display.short_description = "Status"
    is_active_display.admin_order_field = "is_active"
