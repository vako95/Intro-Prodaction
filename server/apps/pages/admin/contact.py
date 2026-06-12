from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import StatusBadgeMixin, EmailMixin
from ..models import ContactInquiry


@admin.register(ContactInquiry)
class ContactInquiryAdmin(StatusBadgeMixin, EmailMixin, admin.ModelAdmin):
    list_display = ('name', 'email_display', 'subject_preview', 'status_badge', 'created_at')
    list_filter = ('status', 'created_at', 'resolved_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at', 'updated_at', 'ip_address')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Inquiry Details', {
            'fields': ('subject', 'message')
        }),
        ('Status', {
            'fields': ('status', 'resolved_at')
        }),
        ('Admin Notes', {
            'fields': ('admin_notes',),
            'classes': ('collapse',)
        }),
        ('System Information', {
            'fields': ('ip_address', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def subject_preview(self, obj):
        """Subject preview with truncation"""
        text = obj.subject[:50] + '...' if len(obj.subject) > 50 else obj.subject
        return format_html('<span style="color: #333; font-weight: 500;">{}</span>', text)
    subject_preview.short_description = 'Subject'
    
    def email_display(self, obj):
        """Email with link"""
        return self.get_email_display(obj.email)
    email_display.short_description = 'Email'

    def status_badge(self, obj):
        """Status badge with colors"""
        status_map = {
            'new': ('pending', '🆕 New'),
            'in_progress': ('pending', '⏳ In Progress'),
            'resolved': ('completed', '✅ Resolved'),
            'closed': ('inactive', '🔒 Closed'),
        }
        status_key, label = status_map.get(obj.status, ('inactive', obj.get_status_display()))
        return self.get_status_badge(status_key, label)
    status_badge.short_description = 'Status'

    actions = ['mark_as_resolved', 'mark_as_in_progress']

    def mark_as_resolved(self, request, queryset):
        for inquiry in queryset:
            inquiry.mark_resolved()
        self.message_user(request, f'{queryset.count()} inquiries marked as resolved.')
    mark_as_resolved.short_description = 'Mark selected as resolved'

    def mark_as_in_progress(self, request, queryset):
        queryset.update(status='in_progress')
        self.message_user(request, f'{queryset.count()} inquiries marked as in progress.')
    mark_as_in_progress.short_description = 'Mark selected as in progress'
