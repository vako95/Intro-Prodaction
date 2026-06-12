from django.db import models
from .base import BaseModel, TimeStampedModel


class Quote(BaseModel, TimeStampedModel):
    """Model for VIP quotes/endorsements from industry leaders and partners"""
    
    name = models.CharField(max_length=255, verbose_name="Name")
    name_az = models.CharField(max_length=255, blank=True, verbose_name="Name (AZ)")
    name_en = models.CharField(max_length=255, blank=True, verbose_name="Name (EN)")
    name_ru = models.CharField(max_length=255, blank=True, verbose_name="Name (RU)")
    
    position = models.CharField(max_length=255, verbose_name="Position/Role")
    position_az = models.CharField(max_length=255, blank=True, verbose_name="Position (AZ)")
    position_en = models.CharField(max_length=255, blank=True, verbose_name="Position (EN)")
    position_ru = models.CharField(max_length=255, blank=True, verbose_name="Position (RU)")
    
    quote = models.TextField(verbose_name="Quote Text")
    quote_az = models.TextField(blank=True, verbose_name="Quote (AZ)")
    quote_en = models.TextField(blank=True, verbose_name="Quote (EN)")
    quote_ru = models.TextField(blank=True, verbose_name="Quote (RU)")
    
    image = models.ImageField(upload_to='quotes/', verbose_name="Photo")
    
    is_verified = models.BooleanField(default=False, verbose_name="Verified/Personal")
    order = models.IntegerField(default=0, verbose_name="Display Order")
    
    class Meta:
        db_table = 'pages_quote'
        verbose_name = 'Quote'
        verbose_name_plural = 'Quotes'
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.position}"
