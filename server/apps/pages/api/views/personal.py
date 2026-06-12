from rest_framework import status, permissions
from rest_framework.generics import get_object_or_404
from ..serializers import PersonalSerializer

from ...models import Personal
from rest_framework.views import APIView
from core.responses import ResponseBuilder


class PersonalListView(APIView):
    serializer_class = PersonalSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Personal.objects.active()

    def get(self, request):
        queryset = self.get_queryset()

        serializer = PersonalSerializer(
            instance=queryset,
            many=True,
            context={"request": request},
        )
        return ResponseBuilder.success(
            detail="Personal retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()


class PersonalDetailView(APIView):
    """API endpoint to retrieve a single personal/team member by slug"""
    serializer_class = PersonalSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        member = get_object_or_404(Personal.objects.active(), slug=slug)
        
        serializer = PersonalSerializer(
            instance=member,
            context={"request": request},
        )
        return ResponseBuilder.success(
            detail="Personal detail retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()
