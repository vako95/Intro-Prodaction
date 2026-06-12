from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import StatusBadgeMixin
from ..models import FAQ


@admin.register(FAQ)
class FAQAdmin(StatusBadgeMixin, admin.ModelAdmin):
    list_display = ('question_preview', 'category', 'order', 'status_badge', 'created_at')
    list_filter = ('is_active', 'category', 'created_at')
    search_fields = ('question_en', 'question_ru', 'question_az', 'answer_en')
    list_editable = ('order',)
    ordering = ('category', 'order', 'created_at')
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('Question', {
            'fields': ('question_en', 'question_ru', 'question_az')
        }),
        ('Answer', {
            'fields': ('answer_en', 'answer_ru', 'answer_az')
        }),
        ('Categorization', {
            'fields': ('category',)
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def question_preview(self, obj):
        """Question preview with truncation"""
        text = obj.question_en[:80] + '...' if len(obj.question_en) > 80 else obj.question_en
        return format_html('<span style="color: #333; font-weight: 500;">{}</span>', text)
    question_preview.short_description = 'Question'
    
    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
