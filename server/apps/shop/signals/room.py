import uuid
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils.text import slugify
from ..models import Room


@receiver(pre_save, sender=Room)
def generate_room_slug(sender, instance, **kwargs):
    if not instance.slug:
        unique_suffix = str(uuid.uuid4())[:8]
        instance.slug = slugify(f"{instance.title}-{unique_suffix}")
