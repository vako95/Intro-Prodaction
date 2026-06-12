from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import StatusBadgeMixin
from ..models import Domain


@admin.register(Domain)
class DomainAdmin(StatusBadgeMixin, admin.ModelAdmin):
    list_display = ('name_en', 'slug', 'status_badge', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name_en', 'name_ru', 'name_az')
    prepopulated_fields = {'slug': ('name_en',)}
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Domain Information', {
            'fields': ('name_en', 'name_ru', 'name_az', 'slug')
        }),
        ('Settings', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
