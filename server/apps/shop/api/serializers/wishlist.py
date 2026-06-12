from rest_framework import serializers

from ...models import Wishlist
from .room import RoomListSerializer


class WishlistSerializer(serializers.ModelSerializer):
    """Сериализатор для wishlist с полной информацией о комнате"""
    room = RoomListSerializer(read_only=True)
    room_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Wishlist
        fields = ("id", "room", "room_id", "created_at")
        read_only_fields = ("id", "created_at")

    def validate_room_id(self, value):
        """Проверка существования комнаты"""
        from ...models import Room
        
        if not Room.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Room not found or inactive")
        return value

    def create(self, validated_data):
        """Создание wishlist item с проверкой дубликатов"""
        user = self.context["request"].user
        room_id = validated_data["room_id"]
        
        wishlist_item, created = Wishlist.objects.get_or_create(
            user=user,
            room_id=room_id
        )
        
        if not created:
            raise serializers.ValidationError(
                {"detail": "This room is already in your wishlist"}
            )
        
        return wishlist_item


class WishlistToggleSerializer(serializers.Serializer):
    """Сериализатор для toggle операции (добавить/удалить)"""
    room_id = serializers.IntegerField()

    def validate_room_id(self, value):
        """Проверка существования комнаты"""
        from ...models import Room
        
        if not Room.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Room not found or inactive")
        return value
