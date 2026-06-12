from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.utils import timezone
from datetime import timedelta
from PIL import Image, ImageDraw, ImageFont
import io
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed database with fake data including images'

    def create_placeholder_image(self, width=800, height=600, text='', bg_color=None):
        """Create a placeholder image with text"""
        if bg_color is None:
            bg_color = (
                random.randint(100, 200),
                random.randint(100, 200),
                random.randint(100, 200)
            )
        
        img = Image.new('RGB', (width, height), color=bg_color)
        draw = ImageDraw.Draw(img)
        
        # Add text
        if text:
            try:
                # Try to use a font, fallback to default if not available
                font = ImageFont.truetype("arial.ttf", 40)
            except:
                font = ImageFont.load_default()
            
            # Calculate text position (center)
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            position = ((width - text_width) // 2, (height - text_height) // 2)
            
            draw.text(position, text, fill=(255, 255, 255), font=font)
        
        # Save to BytesIO
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=85)
        buffer.seek(0)
        
        return ContentFile(buffer.read(), name=f'{text.replace(" ", "_").lower()}.jpg')

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('🌱 Starting database seeding with images...'))
        
        # Create users first
        users = self.create_users()
        
        # Seed with images
        self.seed_pages_with_images(users)
        self.seed_shop_with_images(users)
        self.seed_blog_with_images(users)
        
        self.stdout.write(self.style.SUCCESS('✅ Database seeding with images completed!'))

    def create_users(self):
        self.stdout.write('Creating users...')
        users = []
        
        if not User.objects.filter(username='admin').exists():
            admin = User.objects.create_superuser(
                username='admin',
                email='admin@hoexr.com',
                password='admin123'
            )
            users.append(admin)
        
        for i in range(1, 6):
            if not User.objects.filter(username=f'user{i}').exists():
                user = User.objects.create_user(
                    username=f'user{i}',
                    email=f'user{i}@example.com',
                    password='password123'
                )
                users.append(user)
        
        self.stdout.write(self.style.SUCCESS(f'  ✓ {len(users)} users created'))
        return User.objects.all()

    def seed_pages_with_images(self, users):
        self.stdout.write('Seeding pages app with images...')
        self.create_hero_sliders_with_images()
        self.create_services_with_images()
        self.create_food_with_images()
        self.create_personal_with_images()
        self.create_gallery_with_images()
        self.create_offers_with_images()
        self.create_promo_with_images()
        self.create_brands_with_images()

    def create_hero_sliders_with_images(self):
        from apps.pages.models import HeroSlider
        
        sliders = [
            'LUXURY HOTEL',
            'WELCOME',
            'PERFECT GETAWAY'
        ]
        
        for i, text in enumerate(sliders):
            slider, created = HeroSlider.objects.get_or_create(
                title_en=text,
                defaults={
                    'title_ru': text,
                    'title_az': text,
                    'subtitle_en': 'Experience luxury',
                    'subtitle_ru': 'Experience luxury',
                    'subtitle_az': 'Experience luxury',
                    'description_en': 'Lorem ipsum dolor sit amet',
                    'description_ru': 'Lorem ipsum dolor sit amet',
                    'description_az': 'Lorem ipsum dolor sit amet',
                    'is_active': True
                }
            )
            if created and not slider.poster:
                img = self.create_placeholder_image(1920, 1080, text, (50, 100, 150))
                slider.poster.save(f'hero_{i+1}.jpg', img, save=True)
        
        self.stdout.write('  ✓ Hero sliders with images created')

    def create_services_with_images(self):
        from apps.pages.models import Service
        
        services = ['Fitness Center', 'Restaurant', 'Spa Center']
        
        for i, name in enumerate(services):
            service, created = Service.objects.get_or_create(
                title_en=name,
                defaults={
                    'title_ru': name,
                    'title_az': name,
                    'description_en': f'{name} description',
                    'description_ru': f'{name} description',
                    'description_az': f'{name} description',
                    'is_active': True
                }
            )
            if created:
                # Cover image
                if not service.cover_img:
                    img = self.create_placeholder_image(1200, 800, name, (100, 50, 150))
                    service.cover_img.save(f'service_cover_{i+1}.jpg', img, save=False)
                
                # Card image
                if not service.card_image:
                    img = self.create_placeholder_image(600, 400, name, (150, 100, 50))
                    service.card_image.save(f'service_card_{i+1}.jpg', img, save=False)
                
                service.save()
        
        self.stdout.write('  ✓ Services with images created')

    def create_food_with_images(self):
        from apps.pages.models import Food
        
        foods = [
            ('Pasta With Fish', 39),
            ('Fresh Meat', 26),
            ('Spaghetti', 37),
            ('Vegetarian Soup', 42),
            ('Noodles', 16)
        ]
        
        for i, (name, price) in enumerate(foods):
            food, created = Food.objects.get_or_create(
                title_en=name,
                defaults={
                    'title_ru': name,
                    'title_az': name,
                    'description_en': f'Delicious {name}',
                    'description_ru': f'Delicious {name}',
                    'description_az': f'Delicious {name}',
                    'price': price,
                    'is_active': True
                }
            )
            if created and not food.poster:
                img = self.create_placeholder_image(600, 600, name, (200, 150, 100))
                food.poster.save(f'food_{i+1}.jpg', img, save=True)
        
        self.stdout.write('  ✓ Food with images created')

    def create_personal_with_images(self):
        from apps.pages.models import Personal
        
        team = [
            ('Michael Dean', 'Event Planner'),
            ('Frank Burton', 'Hotel Manager'),
            ('Mya Mullins', 'Kitchen Manager'),
            ('Ralph Nguyen', 'Room Service')
        ]
        
        for i, (name, role) in enumerate(team):
            person, created = Personal.objects.get_or_create(
                name_en=name,
                defaults={
                    'name_ru': name,
                    'name_az': name,
                    'role_en': role,
                    'role_ru': role,
                    'role_az': role,
                    'is_active': True
                }
            )
            if created and not person.poster:
                img = self.create_placeholder_image(400, 500, name.split()[0], (80, 120, 160))
                person.poster.save(f'person_{i+1}.jpg', img, save=True)
        
        self.stdout.write('  ✓ Personal with images created')

    def create_gallery_with_images(self):
        from apps.pages.models import GalleryCategory, HotelGallery
        
        categories = [
            ('Exterior', (100, 150, 200)),
            ('Interior', (150, 100, 150)),
            ('Restaurant', (200, 150, 100)),
            ('Pool', (100, 200, 200))
        ]
        
        for cat_name, color in categories:
            cat, _ = GalleryCategory.objects.get_or_create(
                name_en=cat_name,
                defaults={
                    'name_ru': cat_name,
                    'name_az': cat_name,
                    'is_active': True
                }
            )
            
            for i in range(3):
                gallery, created = HotelGallery.objects.get_or_create(
                    title_en=f'{cat_name} Photo {i+1}',
                    category=cat,
                    defaults={
                        'title_ru': f'{cat_name} Photo {i+1}',
                        'title_az': f'{cat_name} Photo {i+1}',
                        'order': i,
                        'is_active': True
                    }
                )
                if created and not gallery.image:
                    img = self.create_placeholder_image(1200, 800, f'{cat_name} {i+1}', color)
                    gallery.image.save(f'gallery_{cat_name}_{i+1}.jpg', img, save=True)
        
        self.stdout.write('  ✓ Gallery with images created')

    def create_offers_with_images(self):
        from apps.pages.models import SpecialOffer
        
        now = timezone.now()
        offers = [
            ('Early Booking -20%', 20),
            ('Weekend Special', 15),
            ('Summer Sale', 25),
            ('Last Minute Deal', 30)
        ]
        
        for i, (title, discount) in enumerate(offers):
            offer, created = SpecialOffer.objects.get_or_create(
                title_en=title,
                defaults={
                    'title_ru': title,
                    'title_az': title,
                    'description_en': 'Special offer description',
                    'description_ru': 'Special offer description',
                    'description_az': 'Special offer description',
                    'discount_percentage': discount,
                    'offer_type': 'seasonal',
                    'valid_from': now,
                    'valid_to': now + timedelta(days=30),
                    'is_active': True
                }
            )
            if created and not offer.image:
                img = self.create_placeholder_image(800, 600, f'-{discount}%', (200, 50, 50))
                offer.image.save(f'offer_{i+1}.jpg', img, save=True)
        
        self.stdout.write('  ✓ Offers with images created')

    def create_promo_with_images(self):
        from apps.pages.models import PromoSection
        
        promos = [
            ('Book Hotel Rooms', 'banner'),
            ('Special Weekend', 'banner'),
            ('Book Now', 'cta')
        ]
        
        for i, (title, ptype) in enumerate(promos):
            promo, created = PromoSection.objects.get_or_create(
                title_en=title,
                defaults={
                    'title_ru': title,
                    'title_az': title,
                    'section_type': ptype,
                    'is_active': True
                }
            )
            if created and not promo.background_image:
                img = self.create_placeholder_image(1600, 900, title, (50, 50, 100))
                promo.background_image.save(f'promo_{i+1}.jpg', img, save=True)
        
        self.stdout.write('  ✓ Promo sections with images created')

    def create_brands_with_images(self):
        from apps.pages.models import Brand
        
        brands = ['Brand A', 'Brand B', 'Brand C', 'Brand D']
        
        for i, name in enumerate(brands):
            brand, created = Brand.objects.get_or_create(
                name_en=name,
                defaults={
                    'name_ru': name,
                    'name_az': name,
                    'is_active': True
                }
            )
            if created and not brand.logo:
                img = self.create_placeholder_image(300, 150, name, (150, 150, 150))
                brand.logo.save(f'brand_{i+1}.jpg', img, save=True)
        
        self.stdout.write('  ✓ Brands with images created')

    def seed_shop_with_images(self, users):
        self.stdout.write('Seeding shop app with images...')
        rooms = self.create_rooms_with_images()
        self.create_room_images(rooms)
        
        # Other shop data without images
        self.create_coupons()
        self.create_wishlist(users, rooms)
        orders = self.create_orders(users, rooms)
        self.create_payments(users, orders)
        self.create_room_reviews(users, rooms)

    def create_rooms_with_images(self):
        from apps.shop.models import Room
        
        rooms_data = [
            ('Luxury Suite Room', 150, (100, 50, 150)),
            ('Deluxe Double Room', 120, (50, 100, 150)),
            ('Standard Double Room', 90, (150, 100, 50)),
            ('Garden Family Room', 180, (50, 150, 100)),
            ('Executive Suite', 200, (150, 50, 100))
        ]
        
        rooms = []
        for i, (title, price, color) in enumerate(rooms_data):
            room, created = Room.objects.get_or_create(
                title_en=title,
                defaults={
                    'title_ru': title,
                    'title_az': title,
                    'subtitle_en': 'Comfortable and spacious',
                    'subtitle_ru': 'Comfortable and spacious',
                    'subtitle_az': 'Comfortable and spacious',
                    'excerpt_en': 'Perfect for your stay',
                    'excerpt_ru': 'Perfect for your stay',
                    'excerpt_az': 'Perfect for your stay',
                    'description_en': 'Detailed room description',
                    'description_ru': 'Detailed room description',
                    'description_az': 'Detailed room description',
                    'price': price,
                    'discount': random.randint(0, 20),
                    'capacity_adult': 2,
                    'capacity_children': 1,
                    'room_count': random.randint(3, 10),
                    'is_active': True
                }
            )
            if created and not room.poster:
                img = self.create_placeholder_image(1000, 700, title.split()[0], color)
                room.poster.save(f'room_{i+1}.jpg', img, save=True)
            
            rooms.append(room)
        
        self.stdout.write('  ✓ Rooms with images created')
        return rooms

    def create_room_images(self, rooms):
        from apps.shop.models import RoomImg
        
        for i, room in enumerate(rooms[:3]):
            for j in range(3):
                room_img, created = RoomImg.objects.get_or_create(
                    room=room,
                    defaults={'is_active': True}
                )
                if created and not room_img.image:
                    color = (random.randint(80, 180), random.randint(80, 180), random.randint(80, 180))
                    img = self.create_placeholder_image(800, 600, f'{room.title_en[:10]} {j+1}', color)
                    room_img.image.save(f'room_img_{i}_{j}.jpg', img, save=True)
        
        self.stdout.write('  ✓ Room images created')

    def create_coupons(self):
        from apps.shop.models import Coupon
        
        now = timezone.now()
        coupons = [
            ('SUMMER20', 20),
            ('WELCOME10', 10),
            ('SAVE50', 50),
            ('WEEKEND15', 15)
        ]
        
        for code, discount in coupons:
            Coupon.objects.get_or_create(
                code=code,
                defaults={
                    'coupon_type': 'percentage' if discount < 50 else 'fixed',
                    'discount_value': discount,
                    'valid_from': now,
                    'valid_to': now + timedelta(days=60),
                    'min_order_amount': 100,
                    'is_active': True
                }
            )
        self.stdout.write('  ✓ Coupons created')

    def create_wishlist(self, users, rooms):
        from apps.shop.models import Wishlist
        
        for user in users[:3]:
            for room in rooms[:2]:
                Wishlist.objects.get_or_create(user=user, room=room)
        self.stdout.write('  ✓ Wishlist created')

    def create_orders(self, users, rooms):
        from apps.shop.models import Order, OrderItem
        
        orders = []
        for i, user in enumerate(users[:3]):
            order = Order.objects.create(
                user=user,
                order_number=f'ORD-{timezone.now().timestamp()}-{i}',
                status=random.choice(['pending', 'confirmed', 'completed']),
                payment_status=random.choice(['pending', 'paid']),
                total_amount=random.randint(200, 500),
                is_active=True
            )
            order.calculate_final_amount()
            order.save()
            
            room = random.choice(rooms)
            OrderItem.objects.create(
                order=order,
                room=room,
                check_in=timezone.now().date() + timedelta(days=7),
                check_out=timezone.now().date() + timedelta(days=10),
                adults=2,
                children=0,
                rooms_count=1,
                price_per_night=room.price,
                nights=3,
                subtotal=room.price * 3
            )
            orders.append(order)
        
        self.stdout.write('  ✓ Orders created')
        return orders

    def create_payments(self, users, orders):
        from apps.shop.models import Payment
        
        for order in orders:
            Payment.objects.get_or_create(
                order=order,
                defaults={
                    'user': order.user,
                    'amount': order.final_amount,
                    'payment_method': random.choice(['card', 'cash', 'paypal']),
                    'status': 'completed' if order.payment_status == 'paid' else 'pending',
                }
            )
        self.stdout.write('  ✓ Payments created')

    def create_room_reviews(self, users, rooms):
        from apps.shop.models import RoomReview
        
        reviews = [
            ('Excellent Stay', 5),
            ('Very Good', 4),
            ('Good Experience', 4),
            ('Perfect!', 5)
        ]
        
        for i, (title, rating) in enumerate(reviews):
            if i < len(users) and i < len(rooms):
                RoomReview.objects.get_or_create(
                    user=users[i],
                    room=rooms[i],
                    defaults={
                        'title': title,
                        'rating': rating,
                        'comment': f'{title} - Great room!',
                        'is_approved': True,
                        'is_verified': True,
                        'is_active': True
                    }
                )
        self.stdout.write('  ✓ Room reviews created')

    def seed_blog_with_images(self, users):
        self.stdout.write('Seeding blog app with images...')
        from apps.blog.models import News, Category
        
        # Create categories
        categories = []
        for name in ['Tips & Tricks', 'Hotel News', 'Travel Guide']:
            cat, _ = Category.objects.get_or_create(
                title_en=name,
                defaults={
                    'title_ru': name,
                    'title_az': name,
                    'is_active': True
                }
            )
            categories.append(cat)
        
        # Create news with images
        news_data = [
            ('Retore Lighting Design', (100, 150, 200)),
            ('Swimming Benefits', (50, 150, 100)),
            ('Health Club Fitness', (150, 100, 50)),
            ('New Restaurant Menu', (200, 100, 100))
        ]
        
        for i, (title, color) in enumerate(news_data):
            news, created = News.objects.get_or_create(
                title_en=title,
                defaults={
                    'title_ru': title,
                    'title_az': title,
                    'content_en': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    'content_ru': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    'content_az': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    'category': categories[i % len(categories)],
                    'author': users[0] if users else None,
                    'is_active': True
                }
            )
            if created and not news.poster:
                img = self.create_placeholder_image(800, 600, title.split()[0], color)
                news.poster.save(f'news_{i+1}.jpg', img, save=True)
        
        self.stdout.write('  ✓ Blog with images created')
