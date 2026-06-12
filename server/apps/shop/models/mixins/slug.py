from django.db import models
from ...utils import generate_unique_slug, slugify_field


class SlugMixin(models.Model):
    slug_source_field: str | None = None
    slug = models.SlugField(
        max_length=255,
        unique=True,
        blank=True,
        verbose_name="Slug",
        help_text="Unique URL-friendly identifier. Generated automatically if left empty.",
    )

    def get_slug_source(self) -> str:
        if not self.slug_source_field:
            raise NotImplementedError(
                "Either set `slug_source_field` or override `get_slug_source()`."
            )
        return getattr(self, self.slug_source_field)

    @property
    def base_slug(self) -> str:
        return slugify_field(self.get_slug_source())

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(
                self.base_slug, self._meta.get_field("slug").max_length
            )
        return super().save(*args, **kwargs)

    class Meta:
        abstract = True
