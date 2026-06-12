from django.contrib import admin
from django.utils.html import format_html
from ..models import Category
from apps.users.admin.mixins import StatusBadgeMixin


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin, StatusBadgeMixin):
    list_display = ("title_display", "slug", "domain", "news_count_display", "created_at")
    search_fields = ("title_en", "title_az", "title_ru", "slug")
    readonly_fields = ("slug", "created_at", "updated_at")
    ordering = ("-created_at",)
    
    fieldsets = (
        ("Basic Information", {
            "fields": ("slug", "is_active", "domain")
        }),
        ("Titles", {
            "fields": ("title_az", "title_en", "title_ru")
        }),
        ("Media", {
            "fields": ("poster",)
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )
    
    def title_display(self, obj):
        """Название категории"""
        return format_html('<strong style="color: #1976D2;">{}</strong>', obj.title_en)
    title_display.short_description = "Category"
    
    def news_count_display(self, obj):
        """Количество новостей"""
        count = obj.news.count()
        return format_html(
            '<span style="background: #E3F2FD; color: #1976D2; padding: 4px 12px; '
            'border-radius: 12px; font-weight: 600; font-size: 11px;">{} news</span>',
            count
        )
    news_count_display.short_description = "News Count"
