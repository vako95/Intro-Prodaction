from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.pages.models import ContactInquiry, HotelInfo
from ..serializers.contact import ContactInquirySerializer, HotelContactInfoSerializer


class ContactInquiryCreateView(generics.CreateAPIView):
    """
    API endpoint для создания обращения через форму контактов
    """
    queryset = ContactInquiry.objects.all()
    serializer_class = ContactInquirySerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'message': 'Your inquiry has been submitted successfully. We will contact you soon.',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )


class HotelContactInfoView(generics.RetrieveAPIView):
    """
    API endpoint для получения контактной информации отеля
    """
    serializer_class = HotelContactInfoSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        # HotelInfo - singleton, возвращаем первую запись
        return HotelInfo.objects.first()
