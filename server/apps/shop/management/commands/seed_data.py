import random
from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

User = get_user_model()


class Command(BaseCommand):
    help = "Seed database with realistic fake data"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing data first",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self._clear_data()

        self.stdout.write("Seeding database...")

        users = self._create_users()
        rooms = self._create_rooms()
        self._create_orders(users, rooms)

        self.stdout.write(self.style.SUCCESS("\n✅ Database seeded successfully!"))
        self.stdout.write(f"  Users: {len(users)}")
        self.stdout.write(f"  Rooms: {len(rooms)}")

    def _clear_data(self):
        from apps.shop.models import Order, Room, RoomOrder

        self.stdout.write("Clearing existing data...")
        Order.objects.all().delete()
        RoomOrder.objects.all().delete()
        Room.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("✓ Data cleared"))

    def _create_users(self):
        usernames = ["john_doe", "jane_smith", "bob_wilson", "alice_brown", "charlie_davis"]
        users = []

        for username in usernames:
            first_name, last_name = username.split("_")
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "email": f"{username}@example.com",
                    "first_name": first_name.capitalize(),
                    "last_name": last_name.capitalize(),
                },
            )
            
            if created:
                user.set_password("password123")
                user.save()
                self.stdout.write(f"  ✓ Created user: {username}")
            
            users.append(user)

        return users

    def _create_rooms(self):
        from core.constants import ICON_CHOICES

        from apps.shop.models import Room, RoomIcon

        rooms_data = [
            {
                "title": "Standard Single Room",
                "subtitle": "Cozy room for solo travelers",
                "excerpt": "Perfect for business trips or solo adventures",
                "description": "<p>Our Standard Single Room offers comfort and functionality. Features include a comfortable single bed, work desk, free Wi-Fi, and en-suite bathroom.</p>",
                "price": 80,
                "capacity_adult": 1,
                "capacity_children": 0,
                "room_count": 10,
                "discount": 0,
            },
            {
                "title": "Standard Double Room",
                "subtitle": "Comfortable room for couples",
                "excerpt": "Ideal for couples seeking comfort",
                "description": "<p>Spacious double room with queen-size bed, modern amenities, flat-screen TV, mini-bar, and city views.</p>",
                "price": 120,
                "capacity_adult": 2,
                "capacity_children": 0,
                "room_count": 15,
                "discount": 10,
            },
            {
                "title": "Deluxe Room",
                "subtitle": "Premium comfort and style",
                "excerpt": "Upgraded amenities for discerning guests",
                "description": "<p>Experience luxury in our Deluxe Room featuring king-size bed, separate seating area, premium toiletries, and stunning views.</p>",
                "price": 180,
                "capacity_adult": 2,
                "capacity_children": 1,
                "room_count": 8,
                "discount": 15,
            },
            {
                "title": "Family Suite",
                "subtitle": "Spacious suite for families",
                "excerpt": "Perfect for family vacations",
                "description": "<p>Our Family Suite offers two bedrooms, living area, kitchenette, and two bathrooms. Ideal for families with children.</p>",
                "price": 250,
                "capacity_adult": 4,
                "capacity_children": 2,
                "room_count": 5,
                "discount": 20,
            },
            {
                "title": "Executive Suite",
                "subtitle": "Luxury business accommodation",
                "excerpt": "For executives who demand the best",
                "description": "<p>Premium suite with separate bedroom, executive lounge access, work area, and premium amenities.</p>",
                "price": 350,
                "capacity_adult": 2,
                "capacity_children": 1,
                "room_count": 4,
                "discount": 0,
            },
            {
                "title": "Presidential Suite",
                "subtitle": "Ultimate luxury experience",
                "excerpt": "The pinnacle of luxury",
                "description": "<p>Our most luxurious suite featuring panoramic views, private terrace, jacuzzi, butler service, and exclusive amenities.</p>",
                "price": 600,
                "capacity_adult": 4,
                "capacity_children": 2,
                "room_count": 2,
                "discount": 0,
            },
        ]

        rooms = []
        icon_choices = [choice[0] for choice in ICON_CHOICES]

        for data in rooms_data:
            room, created = Room.objects.get_or_create(
                title_en=data["title"],
                defaults={
                    "title_az": data["title"],
                    "title_ru": data["title"],
                    "subtitle_az": data["subtitle"],
                    "subtitle_en": data["subtitle"],
                    "subtitle_ru": data["subtitle"],
                    "excerpt_az": data["excerpt"],
                    "excerpt_en": data["excerpt"],
                    "excerpt_ru": data["excerpt"],
                    "description_az": data["description"],
                    "description_en": data["description"],
                    "description_ru": data["description"],
                    "price": data["price"],
                    "discount": data["discount"],
                    "capacity_adult": data["capacity_adult"],
                    "capacity_children": data["capacity_children"],
                    "room_count": data["room_count"],
                    "is_active": True,
                },
            )

            if created:
                icon_keys = random.sample(icon_choices, min(4, len(icon_choices)))
                for key in icon_keys:
                    RoomIcon.objects.create(room=room, key=key)
                self.stdout.write(f'  ✓ Created room: {data["title"]}')

            rooms.append(room)

        return rooms

    def _create_orders(self, users, rooms):
        from apps.shop.api.services import OrderService

        for i in range(15):
            user = random.choice(users)
            num_items = random.randint(1, 2)

            items_data = []
            base_date = timezone.now().date() + timedelta(days=random.randint(5, 90))

            for _ in range(num_items):
                room = random.choice(rooms)
                check_in = base_date + timedelta(days=random.randint(0, 5))
                nights = random.randint(2, 7)
                check_out = check_in + timedelta(days=nights)

                items_data.append({
                    "room_id": room.id,
                    "check_in": check_in,
                    "check_out": check_out,
                    "adults": random.randint(1, room.capacity_adult),
                    "children": random.randint(0, room.capacity_children),
                    "rooms_count": 1,
                })

            try:
                order = OrderService.create_order(user, items_data)

                statuses = ["pending", "confirmed", "completed"]
                order.status = random.choice(statuses)

                if order.status == "completed":
                    order.payment_status = "paid"
                elif order.status == "confirmed":
                    order.payment_status = random.choice(["pending", "paid"])
                else:
                    order.payment_status = "pending"

                order.save(update_fields=["status", "payment_status", "updated_at"])
                self.stdout.write(f"  ✓ Created order: {order.order_number}")
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"  ✗ Failed: {str(e)}"))
