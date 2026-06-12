from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import StatusBadgeMixin, EmailMixin
from ..models import Newsletter


@admin.register(Newsletter)
class NewsletterAdmin(StatusBadgeMixin, EmailMixin, admin.ModelAdmin):
    list_display = ('email_display', 'status_badge', 'subscribed_at', 'unsubscribed_at')
    list_filter = ('is_active', 'subscribed_at', 'unsubscribed_at')
    search_fields = ('email',)
    readonly_fields = ('subscribed_at', 'unsubscribed_at', 'ip_address')
    ordering = ('-subscribed_at',)
    date_hierarchy = 'subscribed_at'

    fieldsets = (
        ('Subscription Information', {
            'fields': ('email', 'is_active')
        }),
        ('Dates', {
            'fields': ('subscribed_at', 'unsubscribed_at')
        }),
        ('System Information', {
            'fields': ('ip_address',),
            'classes': ('collapse',)
        }),
    )
    
    def email_display(self, obj):
        """Email with link"""
        return self.get_email_display(obj.email)
    email_display.short_description = 'Email'

    def status_badge(self, obj):
        """Status badge"""
        if obj.is_active:
            return self.get_status_badge('active', '✓ Subscribed')
        return self.get_status_badge('inactive', '✗ Unsubscribed')
    status_badge.short_description = 'Status'

    actions = ['unsubscribe_selected']

    def unsubscribe_selected(self, request, queryset):
        count = 0
        for subscription in queryset.filter(is_active=True):
            subscription.unsubscribe()
            count += 1
        self.message_user(request, f'{count} subscriptions unsubscribed.')
    unsubscribe_selected.short_description = 'Unsubscribe selected'
