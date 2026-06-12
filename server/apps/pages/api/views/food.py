from rest_framework.views import APIView
from rest_framework import status

from ...models import Food
from ..serializers import FoodSerializer
from core.responses import ResponseBuilder


class FoodListView(APIView):
    serializer_class = FoodSerializer

    def get_queryset(self):
        return Food.objects.active().filter(is_active=True).prefetch_related("tag")

    def get(self, request):
        queryset = self.get_queryset()

        serializer = self.serializer_class(
            instance=queryset,
            many=True,
            context={"request": request},
        )

        return ResponseBuilder.success(
            detail=(
                "Foods retrieved successfully"
                if queryset.exists()
                else "No food items found"
            ),
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        ).standard()

    # def retrieve(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     serializer = self.get_serializer(instance)
    #     return Response(
    #         {
    #             "success": True,
    #             "message": "Food fetched successfully",
    #             "data": serializer.data,
    #         }
    #     )


# class FoodViewSet(viewsets.ModelViewSet):
#     queryset = Food.objects.filter(is_active=True)
#     serializer_class = FoodSerializer
#     lookup_field = "slug"


#     def list(self, request, *args, **kwargs):
#         queryset = self.filter_queryset(self.get_queryset())

#         page = self.paginate_queryset(queryset)
#         if page is not None:
#             serializer = self.get_serializer(page, many=True)
#             return self.get_paginated_response(serializer.data)

#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)

# queryset = Food.objects.all()
# serializer_class = FoodSerializer
# lookup_field = "slug"
# filter_backends = [DjangoFilterBackend]
