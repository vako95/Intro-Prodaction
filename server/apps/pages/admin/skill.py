from django.contrib import admin
from ..models.personal import PersonalSkill


class PersonalSkillInline(admin.StackedInline):
    model = PersonalSkill
    extra = 1
    fields = (("name_en", "value"), ("name_ru", "name_az"), "order")
    classes = ('collapse',)


@admin.register(PersonalSkill)
class PersonalSkillAdmin(admin.ModelAdmin):
    list_display = ("name_en", "personal", "value", "order", "created_at")
    list_filter = ("personal", "created_at")
    search_fields = ("name_en", "name_ru", "name_az", "personal__name_en")
    ordering = ("personal", "order", "id")
    
    fieldsets = (
        ("Skill Information", {
            "fields": ("personal", "value", "order")
        }),
        ("Translations", {
            "fields": ("name_en", "name_ru", "name_az")
        }),
    )
