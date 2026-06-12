from django.core.management.base import BaseCommand
from apps.pages.models import Personal


class Command(BaseCommand):
    help = 'Add social links to personal records'

    def handle(self, *args, **options):
        sample_social = [
            {
                "platform": "twitter",
                "url": "https://twitter.com/hoexr"
            },
            {
                "platform": "facebook",
                "url": "https://facebook.com/hoexr"
            },
            {
                "platform": "youtube",
                "url": "https://youtube.com/@hoexr"
            },
            {
                "platform": "instagram",
                "url": "https://instagram.com/hoexr"
            }
        ]
        
        personal_records = Personal.objects.all()
        
        if not personal_records.exists():
            self.stdout.write(self.style.WARNING('No personal records found.'))
            return
        
        updated_count = 0
        
        for personal in personal_records:
            if not personal.social_links or len(personal.social_links) == 0:
                personal.social_links = sample_social
                personal.save()
                updated_count += 1
                self.stdout.write(self.style.SUCCESS(f'Added social links to {personal.name_en}'))
            else:
                self.stdout.write(self.style.WARNING(f'Social links already exist for {personal.name_en}'))
        
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count} personal records'))
