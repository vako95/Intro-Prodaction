from django.core.management.base import BaseCommand
from apps.shop.models import Room, RoomIcon, RoomImg, Order, OrderItem, RoomOrder, Cart, CartItem


class Command(BaseCommand):
    help = 'Clear all shop data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm deletion without prompt',
        )

    def handle(self, *args, **options):
        if not options['confirm']:
            confirm = input('Are you sure you want to delete all shop data? (yes/no): ')
            if confirm.lower() != 'yes':
                self.stdout.write(self.style.WARNING('Operation cancelled'))
                return

        self.stdout.write('Clearing shop data...')
        
        counts = {
            'OrderItem': OrderItem.objects.count(),
            'Order': Order.objects.count(),
            'RoomOrder': RoomOrder.objects.count(),
            'CartItem': CartItem.objects.count(),
            'Cart': Cart.objects.count(),
            'RoomImg': RoomImg.objects.count(),
            'RoomIcon': RoomIcon.objects.count(),
            'Room': Room.objects.count(),
        }
        
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        RoomOrder.objects.all().delete()
        CartItem.objects.all().delete()
        Cart.objects.all().delete()
        RoomImg.objects.all().delete()
        RoomIcon.objects.all().delete()
        Room.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('✅ Shop data cleared!'))
        self.stdout.write('Deleted:')
        for model, count in counts.items():
            self.stdout.write(f'  - {model}: {count}')
