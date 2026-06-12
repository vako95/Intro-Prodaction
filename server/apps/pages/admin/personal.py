from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin, EmailMixin
from ..models import Personal
from .skill import PersonalSkillInline
from .personal_social_link import PersonalSocialLinkInline


@admin.register(Personal)
class PersonalAdmin(ImagePreviewMixin, StatusBadgeMixin, EmailMixin, admin.ModelAdmin):
    list_display = ["id",'poster_preview', 'name_en', 'role_en', 'email_display', 'phone', 'status_badge', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name_en', 'name_ru', 'name_az', 'role_en', 'email', 'phone']
    inlines = [PersonalSkillInline, PersonalSocialLinkInline]
    readonly_fields = ['slug', 'created_at', 'updated_at']
    list_display_links = ['id', 'name_en']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name_en', 'name_ru', 'name_az', 'role_en', 'role_ru', 'role_az')
        }),
        ('Biography', {
            'fields': ('bio_en', 'bio_ru', 'bio_az')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'website', 'address', 'age', 'blood_group')
        }),
        ('Media', {
            'fields': ('poster',)
        }),
        ('Settings', {
            'fields': ('is_active', 'slug')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def poster_preview(self, obj):
        """Circular poster preview"""
        if obj.poster:
            return self.get_image_preview(obj.poster.url, size=50, caption=obj.name_en)
        return format_html('<span style="color: #999;">No image</span>')
    poster_preview.short_description = 'Photo'
    
    def email_display(self, obj):
        """Email with link"""
        return self.get_email_display(obj.email)
    email_display.short_description = 'Email'
    
    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
