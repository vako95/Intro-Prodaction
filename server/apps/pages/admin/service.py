from django.contrib import admin
from django.utils.html import format_html
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin
from ..models import Service
from ..models.service import ServiceVideo, ServiceFeature, ServiceFeatureItem


class ServiceVideoInline(admin.StackedInline):
    model = ServiceVideo
    extra = 1


class ServiceFeatureInline(admin.StackedInline):
    model = ServiceFeature
    extra = 1


class ServiceFeatureItemInline(admin.TabularInline):
    model = ServiceFeatureItem
    extra = 0
    max_num = 2


@admin.register(Service)
class ServiceAdmin(ImagePreviewMixin, StatusBadgeMixin, admin.ModelAdmin):
    list_display = ("id",'cover_preview', 'title_en', 'slug', 'status_badge', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title_en', 'title_ru', 'title_az', 'description_en')
    prepopulated_fields = {'slug': ('title_en',)}
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ServiceVideoInline, ServiceFeatureInline, ServiceFeatureItemInline]
    list_display_links = ('id', 'title_en')
    fieldsets = (
        ('Titles', {
            'fields': ('title_en', 'title_ru', 'title_az', 'slug')
        }),
        ('Descriptions', {
            'fields': ('description_en', 'description_ru', 'description_az')
        }),
        ('Images', {
            'fields': ('cover_img', 'card_image', 'card_icon')
        }),
        ('Settings', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def cover_preview(self, obj):
        """Circular cover image preview"""
        if obj.cover_img:
            return self.get_image_preview(obj.cover_img.url, size=50, caption=obj.title_en)
        elif obj.card_image:
            return self.get_image_preview(obj.card_image.url, size=50, caption=obj.title_en)
        return format_html('<span style="color: #999;">No image</span>')
    cover_preview.short_description = 'Cover'
    
    def status_badge(self, obj):
        """Active status badge"""
        return self.get_boolean_badge(obj.is_active, 'Active', 'Inactive')
    status_badge.short_description = 'Status'
