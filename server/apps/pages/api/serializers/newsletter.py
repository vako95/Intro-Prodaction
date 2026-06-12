from rest_framework import serializers
from django.core.validators import EmailValidator
from django.utils import timezone

from ...models import Newsletter


class NewsletterSubscribeSerializer(serializers.Serializer):
    """Serializer for newsletter subscription"""
    
    email = serializers.EmailField(
        required=True,
        validators=[EmailValidator()],
        help_text="Email address for newsletter subscription"
    )
    
    def validate_email(self, value):
        """Validate email is not already subscribed"""
        # Normalize email to lowercase
        value = value.lower().strip()
        
        # Check if already subscribed and active
        if Newsletter.objects.filter(email=value, is_active=True).exists():
            raise serializers.ValidationError(
                "This email is already subscribed to our newsletter."
            )
        
        return value
    
    def create(self, validated_data):
        """Create or reactivate newsletter subscription"""
        email = validated_data['email']
        ip_address = self.context.get('ip_address')
        
        # Check if email exists but is unsubscribed
        try:
            newsletter = Newsletter.objects.get(email=email)
            if not newsletter.is_active:
                # Reactivate subscription
                newsletter.is_active = True
                newsletter.unsubscribed_at = None
                newsletter.subscribed_at = timezone.now()
                newsletter.ip_address = ip_address
                newsletter.save(update_fields=[
                    'is_active', 
                    'unsubscribed_at', 
                    'subscribed_at', 
                    'ip_address'
                ])
                return newsletter
        except Newsletter.DoesNotExist:
            pass
        
        # Create new subscription
        newsletter = Newsletter.objects.create(
            email=email,
            ip_address=ip_address,
            is_active=True
        )
        
        return newsletter


class NewsletterUnsubscribeSerializer(serializers.Serializer):
    """Serializer for newsletter unsubscription"""
    
    email = serializers.EmailField(
        required=True,
        validators=[EmailValidator()],
        help_text="Email address to unsubscribe"
    )
    
    def validate_email(self, value):
        """Validate email exists and is subscribed"""
        value = value.lower().strip()
        
        try:
            newsletter = Newsletter.objects.get(email=value)
            if not newsletter.is_active:
                raise serializers.ValidationError(
                    "This email is not subscribed to our newsletter."
                )
        except Newsletter.DoesNotExist:
            raise serializers.ValidationError(
                "This email is not found in our newsletter list."
            )
        
        return value
    
    def save(self):
        """Unsubscribe from newsletter"""
        email = self.validated_data['email']
        
        try:
            newsletter = Newsletter.objects.get(email=email, is_active=True)
            newsletter.unsubscribe()
            return newsletter
        except Newsletter.DoesNotExist:
            raise serializers.ValidationError(
                "This email is not subscribed to our newsletter."
            )


class NewsletterSerializer(serializers.ModelSerializer):
    """Serializer for newsletter model (admin use)"""
    
    status = serializers.SerializerMethodField()
    
    class Meta:
        model = Newsletter
        fields = [
            'id',
            'email',
            'is_active',
            'status',
            'subscribed_at',
            'unsubscribed_at',
            'ip_address',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'subscribed_at',
            'unsubscribed_at',
            'created_at',
            'updated_at'
        ]
    
    def get_status(self, obj):
        """Get subscription status"""
        return "Active" if obj.is_active else "Unsubscribed"
