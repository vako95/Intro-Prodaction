import os

from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver

from ..models import User


@receiver(pre_save, sender=User)
def delete_old_avatar_on_update(sender, instance, **kwargs):
    if instance._state.adding and not instance.pk:
        return
    try:
        old_instance = sender.objects.only("avatar").get(pk=instance.pk)
    except sender.DoesNotExist:
        return
    if old_instance.avatar.name != instance.avatar.name:
        old_instance.avatar.delete(save=False)


@receiver(post_delete, sender=User)
def delete_avatar_on_delete(sender, instance, **kwargs):
    if instance.avatar:
        if instance.avatar.path and os.path.isfile(instance.avatar.path):
            instance.avatar.delete(save=False)
