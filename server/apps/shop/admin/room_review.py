from django.contrib import admin
from django.utils.html import format_html
from ..models import ReviewHelpful, RoomReview
from apps.users.admin.mixins import ImagePreviewMixin, StatusBadgeMixin


class ReviewHelpfulInline(admin.TabularInline):
    model = ReviewHelpful
    extra = 0
    readonly_fields = ("user",)
    can_delete = False


@admin.register(RoomReview)
class RoomReviewAdmin(admin.ModelAdmin, ImagePreviewMixin, StatusBadgeMixin):
    list_display = (
        "user_preview",
        "room_title",
        "rating_display",
        "title_preview",
        "is_verified_display",
        "is_approved_display",
        "helpful_count",
        "created_at",
    )
    list_filter = ("rating", "is_verified", "is_approved", "is_active", "created_at")
    search_fields = ("user__username", "user__email", "room__title_en", "title", "comment")
    readonly_fields = ("created_at", "updated_at", "helpful_count", "is_verified")
    autocomplete_fields = ("room", "user")
    raw_id_fields = ("order",)
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    inlines = [ReviewHelpfulInline]

    fieldsets = (
        ("Review Information", {
            "fields": ("room", "user", "order")
        }),
        ("Rating & Content", {
            "fields": ("rating", "title", "comment", "pros", "cons")
        }),
        ("Status", {
            "fields": ("is_verified", "is_approved", "is_active")
        }),
        ("Statistics", {
            "fields": ("helpful_count",),
            "classes": ("collapse",),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )
    
    def user_preview(self, obj):
        """Аватар пользователя"""
        if obj.user and obj.user.avatar:
            return self.get_image_preview(obj.user.avatar.url, size=50, caption=obj.user.username)
        return self.get_image_preview(None)
    user_preview.short_description = ""
    
    def room_title(self, obj):
        """Название комнаты"""
        if obj.room:
            return format_html('<strong style="color: #1976D2;">{}</strong>', obj.room.title_en or '—')
        return '—'
    room_title.short_description = "Room"
    
    def rating_display(self, obj):
        """Рейтинг звездами"""
        stars = "⭐" * obj.rating
        return format_html('<span style="font-size: 16px;">{}</span>', stars)
    rating_display.short_description = "Rating"
    rating_display.admin_order_field = "rating"
    
    def title_preview(self, obj):
        """Превью заголовка"""
        return obj.title[:50] + "..." if len(obj.title) > 50 else obj.title
    title_preview.short_description = "Title"
    
    def is_verified_display(self, obj):
        """Статус верификации"""
        return self.get_boolean_badge(obj.is_verified, '✓ Verified', 'Not Verified')
    is_verified_display.short_description = "Verified"
    is_verified_display.admin_order_field = "is_verified"
    
    def is_approved_display(self, obj):
        """Статус одобрения"""
        return self.get_boolean_badge(obj.is_approved, '✓ Approved', 'Pending')
    is_approved_display.short_description = "Approved"
    is_approved_display.admin_order_field = "is_approved"

    actions = ["approve_reviews", "reject_reviews"]

    def approve_reviews(self, request, queryset):
        count = queryset.update(is_approved=True)
        self.message_user(request, f"{count} reviews approved.")
    approve_reviews.short_description = "Approve selected reviews"

    def reject_reviews(self, request, queryset):
        count = queryset.update(is_approved=False)
        self.message_user(request, f"{count} reviews rejected.")
    reject_reviews.short_description = "Reject selected reviews"


@admin.register(ReviewHelpful)
class ReviewHelpfulAdmin(admin.ModelAdmin):
    list_display = ("id", "review", "user", "created_at")
    list_filter = ("created_at",)
    search_fields = ("review__title", "user__username")
    readonly_fields = ("created_at",)
    autocomplete_fields = ("review", "user")
    ordering = ("-created_at",)
