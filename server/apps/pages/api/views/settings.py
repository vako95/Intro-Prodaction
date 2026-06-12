from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.pages.models import SiteSettings
from ..serializers.settings import SiteSettingsSerializer


class SiteSettingsView(generics.RetrieveAPIView):
    serializer_class = SiteSettingsSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        settings, created = SiteSettings.objects.get_or_create(pk=1)
        return settings


class ToggleMaintenanceView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        settings, created = SiteSettings.objects.get_or_create(pk=1)
        settings.maintenance_mode = not settings.maintenance_mode
        settings.save()
        
        serializer = SiteSettingsSerializer(settings)
        return Response(serializer.data, status=status.HTTP_200_OK)
