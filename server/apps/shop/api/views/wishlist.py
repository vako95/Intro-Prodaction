from rest_framework import status
from rest_framework.generics import ListAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import Wishlist
from ..serializers import WishlistSerializer, WishlistToggleSerializer


class WishlistListView(ListAPIView):
    """
    GET /api/v2/shop/wishlist/
    Получить список всех избранных комнат пользователя
    """
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(
            user=self.request.user
        ).select_related("room").prefetch_related("room__icons")


class WishlistAddView(APIView):
    """
    POST /api/v2/shop/wishlist/add/
    Добавить комнату в избранное
    Body: {"room_id": 1}
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = WishlistSerializer(
            data=request.data,
            context={"request": request}
        )
        
        if serializer.is_valid():
            try:
                wishlist_item = serializer.save()
                return Response(
                    WishlistSerializer(wishlist_item).data,
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response(
                    {"detail": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WishlistRemoveView(DestroyAPIView):
    """
    DELETE /api/v2/shop/wishlist/remove/{room_id}/
    Удалить комнату из избранного
    """
    permission_classes = [IsAuthenticated]
    lookup_field = "room_id"

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        room_id = kwargs.get("room_id")
        
        deleted_count, _ = Wishlist.objects.filter(
            user=request.user,
            room_id=room_id
        ).delete()
        
        if deleted_count > 0:
            return Response(
                {"detail": "Room removed from wishlist"},
                status=status.HTTP_200_OK
            )
        
        return Response(
            {"detail": "Room not found in wishlist"},
            status=status.HTTP_404_NOT_FOUND
        )


class WishlistToggleView(APIView):
    """
    POST /api/v2/shop/wishlist/toggle/
    Добавить или удалить комнату из избранного (toggle)
    Body: {"room_id": 1}
    Response: {"is_wishlisted": true/false, "detail": "..."}
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = WishlistToggleSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        room_id = serializer.validated_data["room_id"]
        user = request.user
        
        wishlist_item = Wishlist.objects.filter(user=user, room_id=room_id).first()
        
        if wishlist_item:
            # Удаляем из избранного
            wishlist_item.delete()
            return Response(
                {
                    "is_wishlisted": False,
                    "detail": "Room removed from wishlist"
                },
                status=status.HTTP_200_OK
            )
        else:
            # Добавляем в избранное
            try:
                wishlist_item = Wishlist.objects.create(user=user, room_id=room_id)
                return Response(
                    {
                        "is_wishlisted": True,
                        "detail": "Room added to wishlist",
                        "wishlist_item": WishlistSerializer(wishlist_item).data
                    },
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response(
                    {"detail": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )


class WishlistCheckView(APIView):
    """
    GET /api/v2/shop/wishlist/check/{room_id}/
    Проверить, находится ли комната в избранном
    Response: {"is_wishlisted": true/false}
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        is_wishlisted = Wishlist.objects.filter(
            user=request.user,
            room_id=room_id
        ).exists()
        
        return Response(
            {"is_wishlisted": is_wishlisted},
            status=status.HTTP_200_OK
        )


class WishlistBulkCheckView(APIView):
    """
    POST /api/v2/shop/wishlist/check-bulk/
    Проверить статус нескольких комнат
    Body: {"room_ids": [1, 2, 3]}
    Response: {"1": true, "2": false, "3": true}
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        room_ids = request.data.get("room_ids", [])
        
        if not isinstance(room_ids, list):
            return Response(
                {"detail": "room_ids must be a list"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        wishlisted_rooms = Wishlist.objects.filter(
            user=request.user,
            room_id__in=room_ids
        ).values_list("room_id", flat=True)
        
        result = {str(room_id): room_id in wishlisted_rooms for room_id in room_ids}
        
        return Response(result, status=status.HTTP_200_OK)
