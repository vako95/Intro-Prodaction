from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers

from ...models import Newsletter
from ..serializers.newsletter import (
    NewsletterSubscribeSerializer,
    NewsletterUnsubscribeSerializer,
    NewsletterSerializer
)


def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class NewsletterSubscribeView(APIView):
    """
    API endpoint for newsletter subscription
    
    POST /api/newsletter/subscribe/
    {
        "email": "user@example.com"
    }
    """
    
    permission_classes = [AllowAny]
    serializer_class = NewsletterSubscribeSerializer
    
    def post(self, request):
        """Subscribe to newsletter"""
        serializer = NewsletterSubscribeSerializer(
            data=request.data,
            context={'ip_address': get_client_ip(request)}
        )
        
        if serializer.is_valid():
            newsletter = serializer.save()
            
            return Response(
                {
                    'success': True,
                    'message': 'Successfully subscribed to newsletter!',
                    'data': {
                        'email': newsletter.email,
                        'subscribed_at': newsletter.subscribed_at
                    }
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            {
                'success': False,
                'message': 'Subscription failed',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class NewsletterUnsubscribeView(APIView):
    """
    API endpoint for newsletter unsubscription
    
    POST /api/newsletter/unsubscribe/
    {
        "email": "user@example.com"
    }
    """
    
    permission_classes = [AllowAny]
    serializer_class = NewsletterUnsubscribeSerializer
    
    def post(self, request):
        """Unsubscribe from newsletter"""
        serializer = NewsletterUnsubscribeSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                newsletter = serializer.save()
                
                return Response(
                    {
                        'success': True,
                        'message': 'Successfully unsubscribed from newsletter',
                        'data': {
                            'email': newsletter.email,
                            'unsubscribed_at': newsletter.unsubscribed_at
                        }
                    },
                    status=status.HTTP_200_OK
                )
            except Exception as e:
                return Response(
                    {
                        'success': False,
                        'message': str(e)
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(
            {
                'success': False,
                'message': 'Unsubscription failed',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class NewsletterCheckView(APIView):
    """
    API endpoint to check if email is subscribed
    
    GET /api/newsletter/check/?email=user@example.com
    """
    
    permission_classes = [AllowAny]
    
    @method_decorator(cache_page(60 * 5))  # Cache for 5 minutes
    @method_decorator(vary_on_headers('User-Agent'))
    def get(self, request):
        """Check if email is subscribed"""
        email = request.query_params.get('email', '').lower().strip()
        
        if not email:
            return Response(
                {
                    'success': False,
                    'message': 'Email parameter is required'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            newsletter = Newsletter.objects.get(email=email)
            
            return Response(
                {
                    'success': True,
                    'data': {
                        'email': newsletter.email,
                        'is_subscribed': newsletter.is_active,
                        'subscribed_at': newsletter.subscribed_at if newsletter.is_active else None
                    }
                },
                status=status.HTTP_200_OK
            )
        except Newsletter.DoesNotExist:
            return Response(
                {
                    'success': True,
                    'data': {
                        'email': email,
                        'is_subscribed': False,
                        'subscribed_at': None
                    }
                },
                status=status.HTTP_200_OK
            )
