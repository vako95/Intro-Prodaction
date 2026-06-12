from django.contrib import admin


class AutoUserAdminMixin(admin.ModelAdmin):
    auto_user_field: str | None = None

    def get_exclude(self, request, obj=None):
        exclude = list(super().get_exclude(request, obj) or [])
        if self.auto_user_field and self.auto_user_field not in exclude:
            exclude.append(self.auto_user_field)
        return exclude

    def save_model(self, request, obj, form, change):
        if self.auto_user_field and not getattr(obj, self.auto_user_field + '_id', None):
            setattr(obj, self.auto_user_field, request.user)
        super().save_model(request, obj, form, change)
