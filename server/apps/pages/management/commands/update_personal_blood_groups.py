from django.core.management.base import BaseCommand
from apps.pages.models import Personal
import random


class Command(BaseCommand):
    help = 'Update personal records with sample blood group data'

    def handle(self, *args, **options):
        blood_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        
        personal_records = Personal.objects.filter(blood_group='')
        
        if not personal_records.exists():
            self.stdout.write(self.style.WARNING('No personal records need updating.'))
            return
        
        updated_count = 0
        
        for personal in personal_records:
            personal.blood_group = random.choice(blood_groups)
            personal.save()
            updated_count += 1
            self.stdout.write(self.style.SUCCESS(f'Updated {personal.name_en} with blood group {personal.blood_group}'))
        
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count} personal records'))
