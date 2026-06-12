from datetime import datetime

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from core.responses import ResponseBuilder

from ...selectors import RoomSelector
from ..serializers.room import RoomDetailSerializer, RoomListSerializer


class RoomListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        params = request.query_params

        check_in = params.get("check_in")
        check_out = params.get("check_out")
        adults = self._parse_int(params.get("adults"))
        children = self._parse_int(params.get("children"))
        rooms_count = self._parse_int(params.get("rooms_count"))
        min_price = self._parse_float(params.get("min_price"))
        max_price = self._parse_float(params.get("max_price"))
        limit = self._parse_int(params.get("limit"))  # Добавляем параметр limit

        if check_in and check_out:
            try:
                check_in_date = datetime.strptime(check_in, "%Y-%m-%d").date()
                check_out_date = datetime.strptime(check_out, "%Y-%m-%d").date()

                rooms = RoomSelector.search_available_rooms(
                    check_in=check_in_date,
                    check_out=check_out_date,
                    adults=adults or 1,
                    children=children or 0,
                    min_price=min_price,
                    max_price=max_price,
                )

                if rooms_count:
                    rooms = [
                        room
                        for room in rooms
                        if hasattr(room, "available_count")
                        and room.available_count >= rooms_count
                    ]

                serializer = RoomListSerializer(
                    rooms,
                    many=True,
                    context={"request": request},
                )

                return ResponseBuilder.success(
                    detail="Rooms retrieved successfully",
                    data=serializer.data,
                ).standard()
            except (ValueError, TypeError) as e:
                return ResponseBuilder.error(
                    detail=f"Invalid date format: {str(e)}",
                    status_code=status.HTTP_400_BAD_REQUEST,
                ).standard()

        rooms = RoomSelector.filter_rooms(
            min_price=min_price,
            max_price=max_price,
            capacity=adults or None,
        ).order_by("-created_at")
        
        # Применяем limit если он указан
        if limit:
            rooms = rooms[:limit]

        serializer = RoomListSerializer(rooms, many=True, context={"request": request})

        return ResponseBuilder.success(
            detail="Rooms retrieved successfully",
            data=serializer.data,
        ).standard()

    @staticmethod
    def _parse_float(value):
        try:
            return float(value) if value else None
        except (ValueError, TypeError):
            return None

    @staticmethod
    def _parse_int(value):
        try:
            return int(value) if value else None
        except (ValueError, TypeError):
            return None


class RoomDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        room = RoomSelector.get_room_by_slug(slug)

        if not room:
            return ResponseBuilder.error(
                detail="Room not found",
                status_code=status.HTTP_404_NOT_FOUND,
            ).standard()

        serializer = RoomDetailSerializer(
            room,
            context={
                "request": request,
                "check_in": request.query_params.get("check_in"),
                "check_out": request.query_params.get("check_out"),
            },
        )

        return ResponseBuilder.success(
            detail="Room retrieved successfully",
            data=serializer.data,
        ).standard()


class RoomSearchView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        check_in = request.data.get("check_in")
        check_out = request.data.get("check_out")

        if not (check_in and check_out):
            return ResponseBuilder.error(
                detail="check_in and check_out are required",
                status_code=status.HTTP_400_BAD_REQUEST,
            ).standard()

        try:
            check_in_date = datetime.strptime(check_in, "%Y-%m-%d").date()
            check_out_date = datetime.strptime(check_out, "%Y-%m-%d").date()
        except (ValueError, TypeError):
            return ResponseBuilder.error(
                detail="Invalid date format. Use YYYY-MM-DD",
                status_code=status.HTTP_400_BAD_REQUEST,
            ).standard()

        rooms = RoomSelector.search_available_rooms(
            check_in=check_in_date,
            check_out=check_out_date,
            adults=request.data.get("adults", 1),
            children=request.data.get("children", 0),
        )

        serializer = RoomListSerializer(rooms, many=True, context={"request": request})

        return ResponseBuilder.success(
            detail="Search completed successfully",
            data=serializer.data,
        ).standard()
