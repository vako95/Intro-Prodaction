from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from ...models import Room, RoomOrder
from ..mixins import TranslationMixin
from ..services import BookingService


class RoomOrderPriceMixin:
    @staticmethod
    def _calculate_nights(check_in, check_out):
        return BookingService.calculate_nights(check_in, check_out)

    @staticmethod
    def _calculate_total_price(room, check_in, check_out, rooms_reserved):
        nights = BookingService.calculate_nights(check_in, check_out)
        return float(room.final_price * rooms_reserved * nights)

    def get_nights(self, obj):
        return self._calculate_nights(obj.check_in, obj.check_out)

    def get_total_price(self, obj):
        return self._calculate_total_price(
            obj.room, obj.check_in, obj.check_out, obj.rooms_reserved
        )


class RoomOrderCreateSerializer(serializers.Serializer):
    room_id = serializers.IntegerField()
    check_in = serializers.DateField()
    check_out = serializers.DateField()
    adults = serializers.IntegerField(min_value=1)
    children = serializers.IntegerField(min_value=0, default=0)
    rooms_count = serializers.IntegerField(min_value=1, default=1)
    coupon_code = serializers.CharField(max_length=50, required=False, allow_blank=True)

    def validate_room_id(self, value):
        if not Room.objects.filter(pk=value, is_active=True).exists():
            raise serializers.ValidationError("Room not found or inactive")
        return value

    def validate(self, data):
        try:
            room = Room.objects.get(pk=data["room_id"], is_active=True)

            BookingService.validate_dates(data["check_in"], data["check_out"])
            BookingService.validate_capacity(
                room, data["adults"], data.get("children", 0)
            )
            BookingService.check_availability(
                room, data["check_in"], data["check_out"], data.get("rooms_count", 1)
            )
        except DjangoValidationError as e:
            raise serializers.ValidationError(str(e))

        return data

    def create(self, validated_data):
        coupon_code = validated_data.pop("coupon_code", None)
        return BookingService.create_booking(
            room_id=validated_data["room_id"],
            check_in=validated_data["check_in"],
            check_out=validated_data["check_out"],
            adults=validated_data["adults"],
            children=validated_data.get("children", 0),
            rooms_count=validated_data.get("rooms_count", 1),
            user=self.context["request"].user,
            coupon_code=coupon_code,
        )


class RoomOrderListSerializer(
    RoomOrderPriceMixin, TranslationMixin, serializers.ModelSerializer
):
    room_title = serializers.SerializerMethodField()
    room_poster = serializers.FileField(source="room.poster", read_only=True)
    room_slug = serializers.CharField(source="room.slug", read_only=True)
    price_per_night = serializers.FloatField(source="room.final_price", read_only=True)
    nights = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    username = serializers.CharField(source="user.username", read_only=True)
    coupon_code = serializers.CharField(source="coupon.code", read_only=True, allow_null=True)

    class Meta:
        model = RoomOrder
        fields = (
            "id",
            "room_title",
            "room_poster",
            "room_slug",
            "price_per_night",
            "nights",
            "total_price",
            "username",
            "adults",
            "children",
            "check_in",
            "check_out",
            "rooms_reserved",
            "status",
            "coupon_code",
            "created_at",
        )

    def get_room_title(self, obj):
        return self.get_translated_field(obj.room, "title")


class RoomOrderDetailSerializer(
    RoomOrderPriceMixin, TranslationMixin, serializers.ModelSerializer
):
    room_title = serializers.SerializerMethodField()
    room_subtitle = serializers.SerializerMethodField()
    room_excerpt = serializers.SerializerMethodField()
    room_description = serializers.SerializerMethodField()
    room_poster = serializers.FileField(source="room.poster", read_only=True)
    room_slug = serializers.CharField(source="room.slug", read_only=True)
    capacity_adult = serializers.IntegerField(
        source="room.capacity_adult", read_only=True
    )
    capacity_children = serializers.IntegerField(
        source="room.capacity_children", read_only=True
    )
    capacity_total = serializers.IntegerField(
        source="room.capacity_total", read_only=True
    )
    price_per_night = serializers.FloatField(source="room.final_price", read_only=True)
    nights = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    price_breakdown = serializers.SerializerMethodField()
    username = serializers.CharField(source="user.username", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)
    coupon_code = serializers.CharField(source="coupon.code", read_only=True, allow_null=True)
    coupon_discount = serializers.SerializerMethodField()

    class Meta:
        model = RoomOrder
        fields = (
            "id",
            "room_title",
            "room_subtitle",
            "room_excerpt",
            "room_description",
            "room_poster",
            "room_slug",
            "capacity_adult",
            "capacity_children",
            "capacity_total",
            "price_per_night",
            "nights",
            "total_price",
            "price_breakdown",
            "user",
            "username",
            "user_email",
            "adults",
            "children",
            "check_in",
            "check_out",
            "rooms_reserved",
            "status",
            "coupon_code",
            "coupon_discount",
            "created_at",
            "updated_at",
        )

    def get_room_title(self, obj):
        return self.get_translated_field(obj.room, "title")

    def get_room_subtitle(self, obj):
        return self.get_translated_field(obj.room, "subtitle")

    def get_room_excerpt(self, obj):
        return self.get_translated_field(obj.room, "excerpt")

    def get_room_description(self, obj):
        return self.get_translated_field(obj.room, "description")

    def get_price_breakdown(self, obj):
        breakdown = BookingService.calculate_price(
            obj.room, obj.check_in, obj.check_out, obj.rooms_reserved
        )
        
        if obj.coupon:
            nights = BookingService.calculate_nights(obj.check_in, obj.check_out)
            total_base = obj.room.final_price * obj.rooms_reserved * nights
            discount = obj.coupon.calculate_discount(total_base)
            breakdown['coupon_code'] = obj.coupon.code
            breakdown['discount_amount'] = float(discount)
            breakdown['final_total'] = float(total_base - discount)
        
        return breakdown
    
    def get_coupon_discount(self, obj):
        if obj.coupon:
            nights = BookingService.calculate_nights(obj.check_in, obj.check_out)
            total_base = obj.room.final_price * obj.rooms_reserved * nights
            return float(obj.coupon.calculate_discount(total_base))
        return 0


class RoomAvailabilitySerializer(serializers.Serializer):
    room_id = serializers.IntegerField()
    check_in = serializers.DateField()
    check_out = serializers.DateField()
    rooms_count = serializers.IntegerField(min_value=1, default=1)

    def validate_room_id(self, value):
        if not Room.objects.filter(pk=value, is_active=True).exists():
            raise serializers.ValidationError("Room not found or inactive")
        return value

    def validate(self, data):
        try:
            BookingService.validate_dates(data["check_in"], data["check_out"])
        except DjangoValidationError as e:
            raise serializers.ValidationError(str(e))
        return data
