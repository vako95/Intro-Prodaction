from django.contrib import admin
from django.utils.html import format_html
from django.core.exceptions import ValidationError
from ..models.personal import PersonalSocialLink


class PersonalSocialLinkInline(admin.TabularInline):
    model = PersonalSocialLink
    extra = 1
    fields = ("icon_preview", "social", "url", "order")
    readonly_fields = ("icon_preview",)
    ordering = ("order",)

    def icon_preview(self, obj):
        if obj.social and obj.social.icon:
            return format_html('<span style="font-size: 20px;">{}</span>', obj.social.icon)
        return format_html('<span style="color: #999;">—</span>')
    icon_preview.short_description = 'Icon'

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        original_clean = formset.clean

        def clean_with_duplicate_check(self):
            original_clean(self)
            if any(self.errors):
                return
            
            social_ids = []
            for form in self.forms:
                if form.cleaned_data and not form.cleaned_data.get('DELETE', False):
                    social = form.cleaned_data.get('social')
                    if social:
                        if social.id in social_ids:
                            raise ValidationError(f'Duplicate social platform: {social.title_en}. Each platform can only be added once.')
                        social_ids.append(social.id)

        formset.clean = clean_with_duplicate_check
        return formset
