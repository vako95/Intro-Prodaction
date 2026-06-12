from django.db import models
from django.db import IntegrityError
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
        max_attempts = 10
        attempt = 0
        
        if not self.slug:
            self.slug = generate_unique_slug(
                self.base_slug, self._meta.get_field("slug").max_length
            )
        elif self.pk:
            try:
                old_instance = self.__class__.objects.get(pk=self.pk)
                old_source = getattr(old_instance, self.slug_source_field)
                new_source = self.get_slug_source()
                if old_source != new_source:
                    self.slug = generate_unique_slug(
                        self.base_slug, self._meta.get_field("slug").max_length
                    )
            except self.__class__.DoesNotExist:
                pass
        
        while attempt < max_attempts:
            try:
                return super().save(*args, **kwargs)
            except IntegrityError as e:
                if 'slug' in str(e).lower() and attempt < max_attempts - 1:
                    self.slug = generate_unique_slug(
                        self.base_slug, self._meta.get_field("slug").max_length
                    )
                    attempt += 1
                else:
                    raise

    class Meta:
        abstract = True
