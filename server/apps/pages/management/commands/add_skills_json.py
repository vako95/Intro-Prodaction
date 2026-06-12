from django.core.management.base import BaseCommand
from apps.pages.models import Personal


class Command(BaseCommand):
    help = 'Add skills to personal records as JSON'

    def handle(self, *args, **options):
        sample_skills = [
            {
                "name_en": "Executive Chef",
                "name_ru": "Шеф-повар",
                "name_az": "Baş aşpaz",
                "value": 90
            },
            {
                "name_en": "Pastry Chef",
                "name_ru": "Кондитер",
                "name_az": "Xəmir ustası",
                "value": 75
            },
            {
                "name_en": "Sous Chef",
                "name_ru": "Су-шеф",
                "name_az": "Köməkçi aşpaz",
                "value": 60
            }
        ]
        
        personal_records = Personal.objects.all()
        
        if not personal_records.exists():
            self.stdout.write(self.style.WARNING('No personal records found.'))
            return
        
        updated_count = 0
        
        for personal in personal_records:
            if not personal.skills or len(personal.skills) == 0:
                personal.skills = sample_skills
                personal.save()
                updated_count += 1
                self.stdout.write(self.style.SUCCESS(f'Added skills to {personal.name_en}'))
            else:
                self.stdout.write(self.style.WARNING(f'Skills already exist for {personal.name_en}'))
        
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count} personal records'))
