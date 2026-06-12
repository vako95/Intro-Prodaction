from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed database with fake data for all models'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('🌱 Starting database seeding...'))
        
        # Create users first
        users = self.create_users()
        
        # Seed pages app
        self.seed_pages(users)
        
        # Seed shop app
        self.seed_shop(users)
        
        # Seed blog app
        self.seed_blog(users)
        
        self.stdout.write(self.style.SUCCESS('✅ Database seeding completed!'))

    def create_users(self):
        self.stdout.write('Creating users...')
        users = []
        
        # Create superuser if not exists
        if not User.objects.filter(username='admin').exists():
            admin = User.objects.create_superuser(
                username='admin',
                email='admin@hoexr.com',
                password='admin123'
            )
            users.append(admin)
            self.stdout.write(self.style.SUCCESS('  ✓ Admin user created'))
        
        # Create regular users
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

    def seed_pages(self, users):
        self.stdout.write('Seeding pages app...')
        self.create_hero_sliders()
        self.create_advantages_bars()
        self.create_promo_sections()
        self.create_services()
        self.create_food()
        self.create_personal()
        self.create_reviews(users)
        self.create_social()
        self.create_brands()
        self.create_tags_categories()
        self.create_faqs()
        self.create_gallery()
        self.create_offers()
        self.create_newsletter()
        self.create_contacts()

    def create_hero_sliders(self):
        from apps.pages.models import HeroSlider
        
        sliders = [
            {'title_en': 'UNIQUE PLACE AND LUXURY HOTEL', 'subtitle_en': 'LIFE ENJOY WITH THE GREAT MOMENTS'},
            {'title_en': 'WELCOME TO HOEXR HOTEL', 'subtitle_en': 'Experience Luxury Like Never Before'},
            {'title_en': 'YOUR PERFECT GETAWAY', 'subtitle_en': 'Relax and Unwind in Style'},
        ]
        
        for data in sliders:
            HeroSlider.objects.get_or_create(
                title_en=data['title_en'],
                defaults={
                    'title_ru': data['title_en'],
                    'title_az': data['title_en'],
                    'subtitle_en': data.get('subtitle_en', ''),
                    'subtitle_ru': data.get('subtitle_en', ''),
                    'subtitle_az': data.get('subtitle_en', ''),
                    'description_en': 'Lorem ipsum dolor sit amet',
                    'description_ru': 'Lorem ipsum dolor sit amet',
                    'description_az': 'Lorem ipsum dolor sit amet',
                    'is_active': True
                }
            )
        self.stdout.write('  ✓ Hero sliders created')

    def create_advantages_bars(self):
        from apps.pages.models import AdvantagesBar
        
        advantages = [
            {'title_en': 'The Best Lighting', 'description_en': 'Modern lighting design'},
            {'title_en': 'The Best Swimming', 'description_en': 'Olympic size pool'},
            {'title_en': 'Luxury Rooms', 'description_en': 'Spacious and comfortable'},
            {'title_en': '24/7 Service', 'description_en': 'Always at your service'},
        ]
        
        for data in advantages:
            AdvantagesBar.objects.get_or_create(
                title_en=data['title_en'],
                defaults={
                    'title_ru': data['title_en'],
                    'title_az': data['title_en'],
                    'description_en': data['description_en'],
                    'description_ru': data['description_en'],
                    'description_az': data['description_en'],
                    'is_active': True
                }
            )
        self.stdout.write('  ✓ Advantages bars created')

    def create_services(self):
        from apps.pages.models import Service, ServiceFeature, ServiceFeatureItem
        
        services_data = [
            {'title_en': 'Fitness Center', 'description_en': 'Modern fitness equipment'},
            {'title_en': 'The Restaurant', 'description_en': 'Fine dining experience'},
            {'title_en': 'Spa Center', 'description_en': 'Relaxation and wellness'},
        ]
        
        for data in services_data:
            service, created = Service.objects.get_or_create(
                title_en=data['title_en'],
                defaults={
                    'title_ru': data['title_en'],
                    'title_az': data['title_en'],
                    'description_en': data['description_en'],
                    'description_ru': data['description_en'],
                    'description_az': data['description_en'],
                    'is_active': True
                }
            )
            
            if created:
                # Create service feature
                ServiceFeature.objects.create(
                    service=service,
                    title_en=f'{data["title_en"]} Features',
                    title_ru=f'{data["title_en"]} Features',
                    title_az=f'{data["title_en"]} Features',
                    content_en='Detailed service features',
                    content_ru='Detailed service features',
                    content_az='Detailed service features'
                )
                
                # Create feature items
                for i in range(2):
                    ServiceFeatureItem.objects.create(
                        service=service,
                        title_en=f'Feature {i+1}',
                        title_ru=f'Feature {i+1}',
                        title_az=f'Feature {i+1}'
                    )
        
        self.stdout.write('  ✓ Services created')

    def create_food(self):
        from apps.pages.models import Food, Tag
        
        # Get or create tags
        tags = []
        for tag_name in ['STARTER', 'NEW', 'VEGAN', 'GLUTEN FREE', 'FISH']:
            tag, _ = Tag.objects.get_or_create(
                name_en=tag_name,
                defaults={'name_ru': tag_name, 'name_az': tag_name, 'is_active': True}
            )
            tags.append(tag)
        
        foods = [
            {'title_en': 'Pasta With Fish', 'price': 39},
            {'title_en': 'Fresh Meat', 'price': 26},
            {'title_en': 'Spaghetti', 'price': 37},
            {'title_en': 'Vegetarian Soup', 'price': 42},
            {'title_en': 'Noodles', 'price': 16},
        ]
        
        for data in foods:
            food, created = Food.objects.get_or_create(
                title_en=data['title_en'],
                defaults={
                    'title_ru': data['title_en'],
                    'title_az': data['title_en'],
                    'description_en': 'Delicious food item',
                    'description_ru': 'Delicious food item',
                    'description_az': 'Delicious food item',
                    'price': data['price'],
                    'is_active': True
                }
            )
            if created and tags:
                food.tag.add(random.choice(tags))
        
        self.stdout.write('  ✓ Food items created')

    def create_personal(self):
        from apps.pages.models import Personal
        
        team = [
            {'name_en': 'Michael Dean', 'role_en': 'Event Planner'},
            {'name_en': 'Frank Burton', 'role_en': 'Hotel Manager'},
            {'name_en': 'Mya Mullins', 'role_en': 'Kitchen Manager'},
            {'name_en': 'Ralph Nguyen', 'role_en': 'Room Service'},
        ]
        
        for data in team:
            Personal.objects.get_or_create(
                name_en=data['name_en'],
                defaults={
                    'name_ru': data['name_en'],
                    'name_az': data['name_en'],
                    'role_en': data['role_en'],
                    'role_ru': data['role_en'],
                    'role_az': data['role_en'],
                    'is_active': True
                }
            )
        self.stdout.write('  ✓ Personal/Team created')

    def create_reviews(self, users):
        from apps.pages.models import Review, ReviewRating
        
        reviews_data = [
            {'message': 'The utanislen quam nestibulum ac quame odion elementum sceisu nthe aucan.'},
            {'message': 'Orci varius natoque penatibu et magnis disney parturient monte nascete ridiculus.'},
            {'message': 'Amazing experience! Will definitely come back again.'},
        ]
        
        for i, data in enumerate(reviews_data):
            if i < len(users):
                review, created = Review.objects.get_or_create(
                    author=users[i],
                    message=data['message'],
                    defaults={'is_active': True}
                )
                
                if created:
                    ReviewRating.objects.create(
                        review=review,
                        author=users[i],
                        rating=random.randint(4, 5)
                    )
        
        self.stdout.write('  ✓ Reviews created')

    def create_social(self):
        from apps.pages.models import Social
        
        socials = [
            {'title_en': 'Facebook', 'url': 'https://facebook.com/hoexr'},
            {'title_en': 'Instagram', 'url': 'https://instagram.com/hoexr'},
            {'title_en': 'Twitter', 'url': 'https://twitter.com/hoexr'},
            {'title_en': 'YouTube', 'url': 'https://youtube.com/@hoexr'},
        ]
        
        for data in socials:
            Social.objects.get_or_create(
                title_en=data['title_en'],
                defaults={
                    'title_ru': data['title_en'],
                    'title_az': data['title_en'],
                    'url': data['url'],
                    'is_active': True
                }
            )
        self.stdout.write('  ✓ Social media links created')

    def create_brands(self):
        from apps.pages.models import Brand
        
        brands = ['Brand A', 'Brand B', 'Brand C', 'Brand D']
        
        for name in brands:
            Brand.objects.get_or_create(
                name_en=name,
                defaults={'name_ru': name, 'name_az': name, 'is_active': True}
            )
        self.stdout.write('  ✓ Brands created')

    def create_tags_categories(self):
        from apps.pages.models import Tag, Category
        
        # Tags for pages
        tags = ['Luxury', 'Comfort', 'Premium', 'Special']
        for name in tags:
            Tag.objects.get_or_create(
                name_en=name,
                defaults={'name_ru': name, 'name_az': name, 'is_active': True}
            )
        
        # Categories for pages
        categories = ['Main', 'Featured', 'Popular']
        for name in categories:
            Category.objects.get_or_create(
                title_en=name,
                defaults={'title_ru': name, 'title_az': name, 'is_active': True}
            )
        
        self.stdout.write('  ✓ Tags and categories created')


    def create_promo_sections(self):
        from apps.pages.models import PromoSection
        
        promos = [
            {'title_en': 'Book Hotel Rooms & Deals', 'section_type': 'video',
             'video_url': 'https://www.youtube.com/watch?v=hddwAIXbKZo'},
            {'title_en': 'Special Weekend Offer', 'section_type': 'banner'},
            {'title_en': 'Book Now and Save', 'section_type': 'cta'},
        ]
        
        for i, data in enumerate(promos):
            PromoSection.objects.get_or_create(
                title_en=data['title_en'],
                defaults={**data, 'order': i, 'is_active': True}
            )
        self.stdout.write('  ✓ Promo sections created')

    def create_faqs(self):
        from apps.pages.models import FAQ
        
        faqs = [
            {'question_en': 'What time is check-in?', 'answer_en': 'Check-in time is 2:00 PM', 'category': 'booking'},
            {'question_en': 'Do you accept credit cards?', 'answer_en': 'Yes, we accept all major credit cards', 'category': 'payment'},
            {'question_en': 'Is breakfast included?', 'answer_en': 'Yes, breakfast is included in all room rates', 'category': 'services'},
            {'question_en': 'Do you have parking?', 'answer_en': 'Yes, we have free parking for all guests', 'category': 'general'},
        ]
        
        for i, data in enumerate(faqs):
            FAQ.objects.get_or_create(
                question_en=data['question_en'],
                defaults={
                    'question_ru': data['question_en'],
                    'question_az': data['question_en'],
                    'answer_en': data['answer_en'],
                    'answer_ru': data['answer_en'],
                    'answer_az': data['answer_en'],
                    'category': data['category'],
                    'order': i,
                    'is_active': True
                }
            )
        self.stdout.write('  ✓ FAQs created')

    def create_gallery(self):
        from apps.pages.models import GalleryCategory, HotelGallery
        
        categories = [
            {'name_en': 'Exterior', 'name_ru': 'Экстерьер', 'name_az': 'Xarici görünüş'},
            {'name_en': 'Interior', 'name_ru': 'Интерьер', 'name_az': 'Daxili görünüş'},
            {'name_en': 'Restaurant', 'name_ru': 'Ресторан', 'name_az': 'Restoran'},
            {'name_en': 'Pool', 'name_ru': 'Бассейн', 'name_az': 'Hovuz'},
        ]
        
        for i, data in enumerate(categories):
            cat, _ = GalleryCategory.objects.get_or_create(
                name_en=data['name_en'],
                defaults={**data, 'order': i, 'is_active': True}
            )
            
            # Create gallery items for each category
            for j in range(2):
                HotelGallery.objects.get_or_create(
                    title_en=f'{data["name_en"]} Photo {j+1}',
                    category=cat,
                    defaults={
                        'title_ru': f'{data["name_ru"]} Фото {j+1}',
                        'title_az': f'{data["name_az"]} Şəkil {j+1}',
                        'order': j,
                        'is_active': True
                    }
                )
        self.stdout.write('  ✓ Gallery created')

    def create_offers(self):
        from apps.pages.models import SpecialOffer
        
        now = timezone.now()
        offers = [
            {'title_en': 'Early Booking -20%', 'discount_percentage': 20, 'offer_type': 'early_booking'},
            {'title_en': 'Weekend Special', 'discount_percentage': 15, 'offer_type': 'weekend'},
            {'title_en': 'Summer Sale', 'discount_percentage': 25, 'offer_type': 'seasonal'},
            {'title_en': 'Last Minute Deal', 'discount_percentage': 30, 'offer_type': 'last_minute'},
        ]
        
        for i, data in enumerate(offers):
            SpecialOffer.objects.get_or_create(
                title_en=data['title_en'],
                defaults={
                    'title_ru': data['title_en'],
                    'title_az': data['title_en'],
                    'description_en': 'Special offer description',
                    'description_ru': 'Описание специального предложения',
                    'description_az': 'Xüsusi təklif təsviri',
                    'discount_percentage': data['discount_percentage'],
                    'offer_type': data['offer_type'],
                    'valid_from': now,
                    'valid_to': now + timedelta(days=30),
                    'order': i,
                    'is_active': True
                }
            )
        self.stdout.write('  ✓ Special offers created')

    def create_newsletter(self):
        from apps.pages.models import Newsletter
        
        emails = ['subscriber1@example.com', 'subscriber2@example.com', 'subscriber3@example.com']
        for email in emails:
            Newsletter.objects.get_or_create(email=email, defaults={'is_active': True})
        self.stdout.write('  ✓ Newsletter subscribers created')

    def create_contacts(self):
        from apps.pages.models import ContactInquiry
        
        inquiries = [
            {'name': 'John Doe', 'email': 'john@example.com', 'subject': 'Booking Question'},
            {'name': 'Jane Smith', 'email': 'jane@example.com', 'subject': 'Room Availability'},
            {'name': 'Bob Johnson', 'email': 'bob@example.com', 'subject': 'Special Request'},
        ]
        
        for data in inquiries:
            ContactInquiry.objects.get_or_create(
                email=data['email'],
                defaults={
                    'name': data['name'],
                    'subject': data['subject'],
                    'message': 'This is a sample inquiry message.',
                    'status': 'new'
                }
            )
        self.stdout.write('  ✓ Contact inquiries created')

    def seed_shop(self, users):
        self.stdout.write('Seeding shop app...')
        rooms = self.create_rooms()
        self.create_room_icons(rooms)
        self.create_room_images(rooms)
        self.create_coupons()
        self.create_wishlist(users, rooms)
        self.create_cart(users, rooms)
        orders = self.create_orders(users)
        room_orders = self.create_room_orders(users, rooms)
        self.create_payments(users, orders)
        self.create_room_reviews(users, rooms, orders)

    def create_rooms(self):
        from apps.shop.models import Room
        
        rooms_data = [
            {'title_en': 'Luxury Suite Room', 'price': 150, 'capacity_adult': 2, 'capacity_children': 1},
            {'title_en': 'Deluxe Double Room', 'price': 120, 'capacity_adult': 2, 'capacity_children': 0},
            {'title_en': 'Standard Double Room', 'price': 90, 'capacity_adult': 2, 'capacity_children': 0},
            {'title_en': 'Garden Family Room', 'price': 180, 'capacity_adult': 4, 'capacity_children': 2},
            {'title_en': 'Executive Suite', 'price': 200, 'capacity_adult': 2, 'capacity_children': 1},
        ]
        
        rooms = []
        for data in rooms_data:
            room, _ = Room.objects.get_or_create(
                title_en=data['title_en'],
                defaults={
                    'title_ru': data['title_en'],
                    'title_az': data['title_en'],
                    'subtitle_en': 'Comfortable and spacious',
                    'subtitle_ru': 'Удобный и просторный',
                    'subtitle_az': 'Rahat və geniş',
                    'excerpt_en': 'Perfect for your stay',
                    'excerpt_ru': 'Идеально для вашего пребывания',
                    'excerpt_az': 'Qalmanız üçün mükəmməl',
                    'description_en': 'Detailed room description',
                    'description_ru': 'Подробное описание номера',
                    'description_az': 'Ətraflı otaq təsviri',
                    'price': data['price'],
                    'discount': random.randint(0, 20),
                    'capacity_adult': data['capacity_adult'],
                    'capacity_children': data['capacity_children'],
                    'room_count': random.randint(3, 10),
                    'is_active': True
                }
            )
            rooms.append(room)
        
        self.stdout.write('  ✓ Rooms created')
        return rooms

    def create_room_icons(self, rooms):
        from apps.shop.models import RoomIcon
        from core.constants import ICON_CHOICES
        
        # Get available icon choices
        available_icons = [choice[0] for choice in ICON_CHOICES[:5]]
        
        for room in rooms[:3]:
            for icon_key in available_icons[:3]:
                RoomIcon.objects.get_or_create(
                    room=room,
                    key=icon_key,
                    defaults={'label': icon_key.replace('_', ' ').title()}
                )
        self.stdout.write('  ✓ Room icons created')

    def create_room_images(self, rooms):
        from apps.shop.models import RoomImg
        
        for room in rooms[:3]:
            for i in range(2):
                RoomImg.objects.get_or_create(
                    room=room,
                    defaults={'is_active': True}
                )
        self.stdout.write('  ✓ Room images created')

    def create_cart(self, users, rooms):
        from apps.shop.models import Cart, CartItem
        
        for user in users[:2]:
            cart, _ = Cart.objects.get_or_create(user=user)
            
            for room in rooms[:2]:
                CartItem.objects.get_or_create(
                    cart=cart,
                    room=room,
                    defaults={
                        'check_in': timezone.now().date() + timedelta(days=10),
                        'check_out': timezone.now().date() + timedelta(days=13),
                        'adults': 2,
                        'children': 0,
                        'rooms_count': 1
                    }
                )
        self.stdout.write('  ✓ Cart items created')

    def create_room_orders(self, users, rooms):
        from apps.shop.models import RoomOrder
        
        room_orders = []
        for i, user in enumerate(users[:3]):
            room = rooms[i % len(rooms)]
            order = RoomOrder.objects.create(
                user=user,
                room=room,
                check_in=timezone.now().date() + timedelta(days=14),
                check_out=timezone.now().date() + timedelta(days=17),
                adults=2,
                children=0,
                rooms_reserved=1,
                status=random.choice(['pending', 'confirmed', 'completed']),
                is_active=True
            )
            room_orders.append(order)
        
        self.stdout.write('  ✓ Room orders created')
        return room_orders


    def create_coupons(self):
        from apps.shop.models import Coupon
        
        now = timezone.now()
        coupons = [
            {'code': 'SUMMER20', 'discount_value': 20, 'coupon_type': 'percentage'},
            {'code': 'WELCOME10', 'discount_value': 10, 'coupon_type': 'percentage'},
            {'code': 'SAVE50', 'discount_value': 50, 'coupon_type': 'fixed'},
            {'code': 'WEEKEND15', 'discount_value': 15, 'coupon_type': 'percentage'},
        ]
        
        for data in coupons:
            Coupon.objects.get_or_create(
                code=data['code'],
                defaults={
                    'coupon_type': data['coupon_type'],
                    'discount_value': data['discount_value'],
                    'valid_from': now,
                    'valid_to': now + timedelta(days=60),
                    'min_order_amount': 100,
                    'usage_limit': 100,
                    'is_active': True
                }
            )
        self.stdout.write('  ✓ Coupons created')

    def create_wishlist(self, users, rooms):
        from apps.shop.models import Wishlist
        
        for user in users[:3]:
            for room in rooms[:2]:
                Wishlist.objects.get_or_create(user=user, room=room)
        self.stdout.write('  ✓ Wishlist items created')

    def create_orders(self, users):
        from apps.shop.models import Order, OrderItem
        from apps.shop.models import Room
        
        rooms = list(Room.objects.all()[:3])
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
            
            # Create order items
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
                    'transaction_id': f'TXN-{timezone.now().timestamp()}',
                }
            )
        self.stdout.write('  ✓ Payments created')

    def create_room_reviews(self, users, rooms, orders):
        from apps.shop.models import RoomReview
        
        reviews = [
            {'title': 'Excellent Stay', 'rating': 5, 'comment': 'Amazing room with great service!'},
            {'title': 'Very Good', 'rating': 4, 'comment': 'Comfortable and clean room.'},
            {'title': 'Good Experience', 'rating': 4, 'comment': 'Nice room, friendly staff.'},
            {'title': 'Perfect!', 'rating': 5, 'comment': 'Everything was perfect!'},
        ]
        
        for i, data in enumerate(reviews):
            if i < len(users) and i < len(rooms):
                RoomReview.objects.get_or_create(
                    user=users[i],
                    room=rooms[i],
                    defaults={
                        'title': data['title'],
                        'rating': data['rating'],
                        'comment': data['comment'],
                        'is_approved': True,
                        'is_verified': True,
                        'is_active': True
                    }
                )
        self.stdout.write('  ✓ Room reviews created')

    def seed_blog(self, users):
        self.stdout.write('Seeding blog app...')
        from apps.blog.models import News, Category, Tag
        
        # Create categories
        categories = []
        for name in ['Tips & Tricks', 'Hotel News', 'Travel Guide', 'Events']:
            cat, _ = Category.objects.get_or_create(
                title_en=name,
                defaults={'title_ru': name, 'title_az': name, 'is_active': True}
            )
            categories.append(cat)
        
        # Create tags
        tags = []
        for name in ['luxury', 'comfort', 'service', 'food', 'spa']:
            tag, _ = Tag.objects.get_or_create(
                name_en=name,
                defaults={'name_ru': name, 'name_az': name, 'is_active': True}
            )
            tags.append(tag)
        
        # Create news
        news_data = [
            {'title_en': 'Retore Lighting Design in The Hotel', 'category': categories[0]},
            {'title_en': 'Swimming Benefits is Good For Your Health', 'category': categories[0]},
            {'title_en': 'Available Now Health Club For Your Fitness', 'category': categories[1]},
            {'title_en': 'New Restaurant Menu Launched', 'category': categories[1]},
        ]
        
        for data in news_data:
            news, created = News.objects.get_or_create(
                title_en=data['title_en'],
                defaults={
                    'title_ru': data['title_en'],
                    'title_az': data['title_en'],
                    'content_en': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    'content_ru': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    'content_az': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    'category': data['category'],
                    'author': users[0] if users else None,
                    'is_active': True
                }
            )
            if created and tags:
                news.tag.add(*tags[:2])
        
        self.stdout.write('  ✓ Blog data created')
