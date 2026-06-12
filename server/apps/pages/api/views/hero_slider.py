from rest_framework.views import APIView
from rest_framework import status
from ...models import HeroSlider
from ..serializers import HeroSliderSerializer
from core.responses import ResponseBuilder


class HeroSliderListView(APIView):
    serializer_class = HeroSliderSerializer

    def get_hero_slider(self):
        return HeroSlider.objects.active().select_related("brand")

    def get(self, request):
        queryset = self.get_hero_slider()
        serializer = self.serializer_class(
            instance=queryset,
            many=True,
            context={"request": request},
        )

        return ResponseBuilder.success(
            detail="Hero sliders retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()
