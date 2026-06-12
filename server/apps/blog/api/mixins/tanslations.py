# from django.conf import settings

# AVAILABLE_LANGS = {lang for lang, _ in settings.LANGUAGES}


# class TranslationMixin:
#     def get_translated_field(self, obj, field_prefix, lang=None):
#         request = self.context.get("request")
#         lang = lang or getattr(request, "LANGUAGE_CODE", settings.LANGUAGE_CODE)
#         if lang not in AVAILABLE_LANGS:
#             lang = settings.LANGUAGE_CODE
#         return getattr(
#             obj,
#             f"{field_prefix}_{lang}",
#             getattr(obj, f"{field_prefix}_{settings.LANGUAGE_CODE}", ""),
#         )
from django.conf import settings
from functools import lru_cache
from django.utils.translation import get_language


@lru_cache(maxsize=1)
def get_available_langs():
    return {lang for lang, _ in settings.LANGUAGES}


class TranslationMixin:
    def get_translated_field(self, obj, field_prefix, lang=None):
        request = self.context.get("request")
        lang = lang or get_language()

        if lang not in get_available_langs():
            lang = settings.LANGUAGE_CODE

        cache_key = f"_translated_{field_prefix}_{lang}"
        if hasattr(obj, cache_key):
            return getattr(obj, cache_key)

        value = getattr(
            obj,
            f"{field_prefix}_{lang}",
            getattr(obj, f"{field_prefix}_{settings.LANGUAGE_CODE}", ""),
        )

        setattr(obj, cache_key, value)
        return value
