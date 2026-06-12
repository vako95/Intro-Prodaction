from django.contrib import admin
from ..models import Review, ReviewRating
from ...users.admin.admin_helpers import AutoUserAdmin
from django.db import models


class ReviewAdmin(AutoUserAdmin):
    list_display = (
        "short_message",
        "author",
        "average_rating",
        "is_active",
        "created_at",
    )
    list_filter = ("is_active", "created_at")
    search_fields = ("message", "message_az", "message_ru", "message_en", "author__username")
    readonly_fields = ("created_at", "updated_at", "average_rating")
    ordering = ("-created_at",)
    
    fieldsets = (
        ("Main Information", {
            "fields": ("is_active",)
        }),
        ("Message (Default)", {
            "fields": ("message",)
        }),
        ("Multilingual Messages", {
            "fields": ("message_az", "message_ru", "message_en"),
            "classes": ("collapse",)
        }),
        ("Metadata", {
            "fields": ("created_at", "updated_at", "average_rating"),
            "classes": ("collapse",)
        }),
    )

    def short_message(self, obj):
        return obj.message[:50]

    short_message.short_description = "Message"

    def average_rating(self, obj):
        avg = obj.ratings.aggregate(avg=models.Avg("rating"))["avg"]
        return round(avg, 2) if avg else None

    average_rating.short_description = "Average Rating"

    def save_model(self, request, obj, form, change):
        if not obj.author_id:
            obj.author = request.user
        super().save_model(request, obj, form, change)


class ReviewRatingAdmin(admin.ModelAdmin):
    list_display = ("review", "author", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("review__message", "author__username")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)


admin.site.register(Review, ReviewAdmin)
admin.site.register(ReviewRating, ReviewRatingAdmin)
