import random
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.shop.models import Order, OrderItem, Room, RoomIcon, RoomImg, RoomOrder
from core.constants import ICON_CHOICES

User = get_user_model()


class Command(BaseCommand):
    help = "Generate fake data for shop app"

    def add_arguments(self, parser):
        parser.add_argument(
            "--users",
            type=int,
            default=5,
            help="Number of users to create",
        )
        parser.add_argument(
            "--rooms",
            type=int,
            default=10,
            help="Number of rooms to create",
        )
        parser.add_argument(
            "--orders",
            type=int,
            default=20,
            help="Number of orders to create",
        )

    def handle(self, *args, **options):
        self.stdout.write("Starting fake data generation...")

        users = self._create_users(options["users"])
        rooms = self._create_rooms(options["rooms"])
        self._create_orders(users, rooms, options["orders"])

        self.stdout.write(self.style.SUCCESS("✅ Fake data generated successfully!"))

    def _create_users(self, count):
        self.stdout.write(f"Creating {count} users...")
        users = []

        for i in range(1, count + 1):
            username = f"user{i}"

            if User.objects.filter(username=username).exists():
                user = User.objects.get(username=username)
                self.stdout.write(f"  → User exists: {username}")
            else:
                user = User.objects.create_user(
                    username=username,
                    email=f"user{i}@example.com",
                    password="password123",
                    first_name=f"User{i}",
                    last_name=f"Test{i}",
                )
                self.stdout.write(f"  ✓ Created user: {username}")

            users.append(user)

        return users

    def _create_rooms(self, count):
        self.stdout.write(f"Creating {count} rooms...")
        rooms = []

        room_types = [
            ("Standard Room", "Comfortable standard room", 100, 2, 0),
            ("Deluxe Room", "Spacious deluxe room", 150, 2, 1),
            ("Family Suite", "Perfect for families", 200, 4, 2),
            ("Executive Suite", "Luxury executive suite", 300, 2, 0),
            ("Presidential Suite", "Ultimate luxury", 500, 4, 2),
        ]

        icon_choices = [choice[0] for choice in ICON_CHOICES]

        for i in range(count):
            room_type = room_types[i % len(room_types)]
            title_en = f"{room_type[0]} {i + 1}"

            if Room.objects.filter(title_en=title_en).exists():
                room = Room.objects.get(title_en=title_en)
                rooms.append(room)
                self.stdout.write(f"  → Room exists: {title_en}")
                continue

            room = Room.objects.create(
                title_az=title_en,
                title_en=title_en,
                title_ru=title_en,
                subtitle_az=room_type[1],
                subtitle_en=room_type[1],
                subtitle_ru=room_type[1],
                excerpt_az=f"Great {room_type[0].lower()} with modern amenities",
                excerpt_en=f"Great {room_type[0].lower()} with modern amenities",
                excerpt_ru=f"Great {room_type[0].lower()} with modern amenities",
                description_az=f"<p>Detailed description of {room_type[0].lower()}</p>",
                description_en=f"<p>Detailed description of {room_type[0].lower()}</p>",
                description_ru=f"<p>Detailed description of {room_type[0].lower()}</p>",
                price=room_type[2],
                discount=random.choice([0, 5, 10, 15, 20]),
                capacity_adult=room_type[3],
                capacity_children=room_type[4],
                room_count=random.randint(3, 10),
                is_active=True,
            )

            icon_keys = random.sample(icon_choices, min(5, len(icon_choices)))
            for key in icon_keys:
                RoomIcon.objects.create(room=room, key=key)

            rooms.append(room)
            self.stdout.write(f"  ✓ Created room: {title_en}")

        return rooms

    def _create_orders(self, users, rooms, count):
        self.stdout.write(f"Creating {count} orders...")

        from apps.shop.api.services import OrderService

        statuses = ["pending", "confirmed", "cancelled", "completed"]
        payment_statuses = ["pending", "paid", "failed"]

        for i in range(count):
            user = random.choice(users)
            num_items = random.randint(1, 3)

            items_data = []
            base_date = timezone.now().date() + timedelta(days=random.randint(1, 60))

            for _ in range(num_items):
                room = random.choice(rooms)
                check_in = base_date + timedelta(days=random.randint(0, 10))
                nights = random.randint(1, 7)
                check_out = check_in + timedelta(days=nights)

                items_data.append({
                    "room_id": room.id,
                    "check_in": check_in,
                    "check_out": check_out,
                    "adults": random.randint(1, room.capacity_adult),
                    "children": random.randint(0, room.capacity_children),
                    "rooms_count": random.randint(1, min(3, room.room_count)),
                })

            try:
                order = OrderService.create_order(user, items_data)

                order.status = random.choice(statuses)

                if order.status == "completed":
                    order.payment_status = "paid"
                elif order.status == "confirmed":
                    order.payment_status = random.choice(["pending", "paid"])
                else:
                    order.payment_status = random.choice(payment_statuses)

                order.save(update_fields=["status", "payment_status", "updated_at"])

                self.stdout.write(
                    f"  ✓ Created order: {order.order_number} ({len(items_data)} items)"
                )
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(f"  ✗ Failed to create order: {str(e)}")
                )
