from rest_framework import serializers
from apps.pages.models import ContactInquiry, HotelInfo


class ContactInquirySerializer(serializers.ModelSerializer):
    """Serializer для создания обращений через форму контактов"""
    
    class Meta:
        model = ContactInquiry
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class HotelContactInfoSerializer(serializers.ModelSerializer):
    """Serializer для получения контактной информации отеля"""
    
    class Meta:
        model = HotelInfo
        fields = [
            'phone_primary',
            'phone_secondary', 
            'email_primary',
            'email_support',
            'address_en',
            'address_ru',
            'address_az',
            'latitude',
            'longitude',
        ]
