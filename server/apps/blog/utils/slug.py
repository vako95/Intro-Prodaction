import uuid
from django.utils.text import slugify


def generate_unique_slug(base_slug: str, max_length: int) -> str:
    uuid_size = 8
    separator_size = 1
    if max_length <= uuid_size + separator_size:
        raise ValueError("max_length too small for slug generation")
    base_slug_size = max_length - uuid_size - separator_size
    base = base_slug[:base_slug_size]
    return f"{base}-{uuid.uuid4().hex[:uuid_size]}"


def slugify_field(value: str) -> str:
    slug = slugify(value) if value else ""
    return slug or "untitled"
