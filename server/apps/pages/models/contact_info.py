"""
Proxy model for Contact Information
Provides a separate admin interface focused on contact details
"""
from .hotel_info import HotelInfo


class ContactInfo(HotelInfo):
    """
    Proxy model for managing contact information in admin
    Same as HotelInfo but with different admin interface
    """
    
    class Meta:
        proxy = True
        verbose_name = "Contact Information"
        verbose_name_plural = "Contact Information"
