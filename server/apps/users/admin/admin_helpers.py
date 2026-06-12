from django.contrib import admin


# class AutoUserAdmin(admin.ModelAdmin):
#     auto_user_field = "author"
#     exclude = (auto_user_field,)

#     def save_model(self, request, obj, form, change):
#         if not change and self.auto_user_field:
#             setattr(obj, self.auto_user_field, request.user)
#         super().save_model(request, obj, form, change)


class AutoUserAdmin(admin.ModelAdmin):
    auto_user_field = "author"

    def get_exclude(self, request, obj=None):
        exclude = list(super().get_exclude(request, obj) or [])
        if self.auto_user_field:
            exclude.append(self.auto_user_field)
        return exclude

    def save_model(self, request, obj, form, change):
        if not change and self.auto_user_field:
            if hasattr(obj, self.auto_user_field):
                setattr(obj, self.auto_user_field, request.user)
        super().save_model(request, obj, form, change)
