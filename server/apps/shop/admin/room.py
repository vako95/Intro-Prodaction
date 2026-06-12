from django.contrib import admin
from django.utils.html import format_html
from ..models import Room, RoomIcon, RoomImg
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin, PriceMixin


class RoomIconInline(admin.TabularInline):
    model = RoomIcon
    extra = 1
    fields = ("key", "label")


class RoomImgInline(admin.TabularInline):
    model = RoomImg
    extra = 1
    fields = ("image_preview", "image")
    readonly_fields = ("image_preview",)
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; '
                'border: 2px solid #e0e0e0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"/>',
                obj.image.url
            )
        return '—'
    image_preview.short_description = 'Preview'


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin, ImagePreviewMixin, StatusBadgeMixin, PriceMixin):
    list_display = (
        "id",
        "poster_preview",
        "title_display",
        "price_display",
        "discount_display",
        "final_price_display",
        "capacity_display",
        "room_count",
        "is_active",
    )
    list_filter = ("is_active", "created_at")
    search_fields = ("title_en", "title_az", "title_ru", "slug")
    readonly_fields = ("id", "slug", "created_at", "updated_at", "poster_display")
    ordering = ("-created_at",)
    inlines = [RoomIconInline, RoomImgInline]
    list_display_links = ("id", "title_display")
    fieldsets = (
        ("Basic Information", {
            "fields": ("id", "slug", "is_active")
        }),
        ("Titles", {
            "fields": ("title_az", "title_en", "title_ru")
        }),
        ("Subtitles", {
            "fields": ("subtitle_az", "subtitle_en", "subtitle_ru"),
            "classes": ("collapse",),
        }),
        ("Content", {
            "fields": ("excerpt_az", "excerpt_en", "excerpt_ru", "description_az", "description_en", "description_ru"),
            "classes": ("collapse",),
        }),
        ("Media", {
            "fields": ("poster", "poster_display")
        }),
        ("Pricing", {
            "fields": ("price", "discount")
        }),
        ("Room Details", {
            "fields": ("size", "beds", "view_az", "view_en", "view_ru")
        }),
        ("Capacity", {
            "fields": ("capacity_adult", "capacity_children", "room_count")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )
    
    def poster_preview(self, obj):
        """Круглое превью постера"""
        if obj.poster:
            return self.get_image_preview(obj.poster.url, size=50, caption=obj.title_en)
        return self.get_image_preview(None)
    poster_preview.short_description = ""
    
    def poster_display(self, obj):
        """Полноразмерный постер"""
        if obj.poster:
            return self.get_image_detail(obj.poster.url, caption=obj.title_en, max_width=500)
        return self.get_image_detail(None)
    poster_display.short_description = "Poster"
    
    def title_display(self, obj):
        """Название комнаты"""
        title = obj.title_en or obj.title_az or obj.title_ru or "—"
        return format_html('<strong style="color: #1976D2;">{}</strong>', title)
    title_display.short_description = "Room Title"
    title_display.admin_order_field = "title_en"
    
    def price_display(self, obj):
        """Цена"""
        return self.get_price_display(obj.price)
    price_display.short_description = "Price"
    price_display.admin_order_field = "price"
    
    def discount_display(self, obj):
        """Скидка"""
        return self.get_discount_badge(obj.discount)
    discount_display.short_description = "Discount"
    discount_display.admin_order_field = "discount"
    
    def final_price_display(self, obj):
        """Финальная цена"""
        return self.get_price_display(obj.final_price, color='#2196F3')
    final_price_display.short_description = "Final Price"
    final_price_display.admin_order_field = "final_price"
    
    def capacity_display(self, obj):
        """Вместимость"""
        return format_html(
            '<span style="color: #666;">👤 {} | 👶 {}</span>',
            obj.capacity_adult, obj.capacity_children
        )
    capacity_display.short_description = "Capacity"


@admin.register(RoomIcon)
class RoomIconAdmin(admin.ModelAdmin):
    list_display = ("id", "room", "key", "label")
    list_filter = ("key",)
    search_fields = ("room__title_en", "label")
    ordering = ("room", "key")


@admin.register(RoomImg)
class RoomImgAdmin(admin.ModelAdmin, ImagePreviewMixin):
    list_display = ("image_preview", "room", "created_at")
    list_filter = ("created_at",)
    search_fields = ("room__title_en",)
    readonly_fields = ("id", "created_at", "updated_at", "image_display")
    ordering = ("room", "-created_at")
    
    fieldsets = (
        ("Basic Information", {
            "fields": ("id", "room")
        }),
        ("Image", {
            "fields": ("image", "image_display")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )
    
    def image_preview(self, obj):
        """Круглое превью"""
        if obj.image:
            return self.get_image_preview(obj.image.url, size=50)
        return self.get_image_preview(None)
    image_preview.short_description = ""
    
    def image_display(self, obj):
        """Полноразмерное изображение"""
        if obj.image:
            return self.get_image_detail(obj.image.url, max_width=600)
        return self.get_image_detail(None)
    image_display.short_description = "Image"
