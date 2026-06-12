from django.core.validators import EmailValidator, MinValueValidator, MaxValueValidator
from django.db import models
from imagekit.models import ProcessedImageField
from django.core.validators import FileExtensionValidator

from .base import BaseModel, TimeStampedModel
from ..utils import upload_to


class SiteSettings(BaseModel, TimeStampedModel):
    """
    Глобальные настройки сайта (Singleton)
    """

    # General Settings
    site_name = models.CharField(
        max_length=255,
        default="Hoexr Luxury Hotel",
        verbose_name="Site Name",
        help_text="Name of the website",
    )
    site_title = models.CharField(
        max_length=255,
        default="Hoexr - Luxury Hotel & Resort",
        verbose_name="Site Title",
        help_text="Browser tab title",
    )
    site_description = models.TextField(
        blank=True,
        verbose_name="Site Description",
        help_text="Short description of the site",
    )
    site_keywords = models.TextField(
        blank=True,
        verbose_name="Site Keywords",
        help_text="SEO keywords, comma separated",
    )

    # Logos & Branding
    logo_light = ProcessedImageField(
        upload_to=upload_to("settings/logos/"),
        validators=[FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png", "webp", "svg"])],
        format="WEBP",
        options={"quality": 90},
        blank=True,
        null=True,
        verbose_name="Light Logo",
        help_text="Logo for light backgrounds",
    )
    logo_dark = ProcessedImageField(
        upload_to=upload_to("settings/logos/"),
        validators=[FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png", "webp", "svg"])],
        format="WEBP",
        options={"quality": 90},
        blank=True,
        null=True,
        verbose_name="Dark Logo",
        help_text="Logo for dark backgrounds",
    )
    favicon = ProcessedImageField(
        upload_to=upload_to("settings/favicon/"),
        validators=[FileExtensionValidator(allowed_extensions=["ico", "png", "svg"])],
        format="PNG",
        options={"quality": 100},
        blank=True,
        null=True,
        verbose_name="Favicon",
        help_text="Site favicon (32x32 or 64x64)",
    )

    # Theme Settings
    primary_color = models.CharField(
        max_length=7,
        default="#aa8453",
        verbose_name="Primary Color",
        help_text="Main brand color (hex format: #RRGGBB)",
    )
    secondary_color = models.CharField(
        max_length=7,
        default="#141212",
        verbose_name="Secondary Color",
        help_text="Secondary brand color (hex format: #RRGGBB)",
    )
    accent_color = models.CharField(
        max_length=7,
        default="#be9867",
        verbose_name="Accent Color",
        help_text="Accent color for highlights (hex format: #RRGGBB)",
    )

    # Features Toggle
    enable_splash_screen = models.BooleanField(
        default=True,
        verbose_name="Enable Splash Screen",
        help_text="Show splash screen on site load",
    )
    enable_custom_cursor = models.BooleanField(
        default=False,
        verbose_name="Enable Custom Cursor",
        help_text="Enable custom animated cursor effect",
    )
    enable_newsletter = models.BooleanField(
        default=True,
        verbose_name="Enable Newsletter",
        help_text="Show newsletter subscription form",
    )
    enable_chat = models.BooleanField(
        default=False,
        verbose_name="Enable Live Chat",
        help_text="Enable live chat widget",
    )
    enable_booking = models.BooleanField(
        default=True,
        verbose_name="Enable Booking",
        help_text="Enable room booking functionality",
    )
    enable_reviews = models.BooleanField(
        default=True,
        verbose_name="Enable Reviews",
        help_text="Allow users to leave reviews",
    )
    enable_wishlist = models.BooleanField(
        default=True,
        verbose_name="Enable Wishlist",
        help_text="Allow users to save favorite rooms",
    )

    # Booking Settings
    min_booking_days = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name="Minimum Booking Days",
        help_text="Minimum number of days for booking",
    )
    max_booking_days = models.PositiveIntegerField(
        default=30,
        validators=[MinValueValidator(1)],
        verbose_name="Maximum Booking Days",
        help_text="Maximum number of days for booking",
    )
    advance_booking_days = models.PositiveIntegerField(
        default=365,
        validators=[MinValueValidator(1)],
        verbose_name="Advance Booking Days",
        help_text="How many days in advance can users book",
    )
    cancellation_hours = models.PositiveIntegerField(
        default=24,
        validators=[MinValueValidator(1)],
        verbose_name="Cancellation Hours",
        help_text="Hours before check-in for free cancellation",
    )

    # Payment Settings
    currency = models.CharField(
        max_length=3,
        default="USD",
        verbose_name="Currency",
        help_text="Default currency code (USD, EUR, GBP, etc.)",
    )
    tax_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name="Tax Rate (%)",
        help_text="Tax rate percentage",
    )
    service_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)],
        verbose_name="Service Fee",
        help_text="Fixed service fee amount",
    )

    # Contact Settings
    support_email = models.EmailField(
        blank=True,
        validators=[EmailValidator()],
        verbose_name="Support Email",
        help_text="Email for customer support",
    )
    support_phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Support Phone",
        help_text="Phone number for support",
    )
    whatsapp_number = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="WhatsApp Number",
        help_text="WhatsApp contact number",
    )

    # Social Media
    facebook_url = models.URLField(blank=True, verbose_name="Facebook URL")
    instagram_url = models.URLField(blank=True, verbose_name="Instagram URL")
    twitter_url = models.URLField(blank=True, verbose_name="Twitter URL")
    linkedin_url = models.URLField(blank=True, verbose_name="LinkedIn URL")
    youtube_url = models.URLField(blank=True, verbose_name="YouTube URL")
    tiktok_url = models.URLField(blank=True, verbose_name="TikTok URL")

    # Analytics & Tracking
    google_analytics_id = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Google Analytics ID",
        help_text="GA tracking ID (e.g., G-XXXXXXXXXX)",
    )
    facebook_pixel_id = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Facebook Pixel ID",
        help_text="Facebook Pixel tracking ID",
    )
    google_tag_manager_id = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Google Tag Manager ID",
        help_text="GTM container ID (e.g., GTM-XXXXXXX)",
    )

    # Maintenance Mode
    maintenance_mode = models.BooleanField(
        default=False,
        verbose_name="Maintenance Mode",
        help_text="Enable maintenance mode (site will be unavailable)",
    )
    maintenance_message_en = models.CharField(
        max_length=255,
        blank=True,
        default="Coming Soon, Stay Tuned!",
        verbose_name="Maintenance Message (EN)",
        help_text="Title message to display during maintenance (English)",
    )
    maintenance_message_ru = models.CharField(
        max_length=255,
        blank=True,
        default="Скоро, Оставайтесь с нами!",
        verbose_name="Maintenance Message (RU)",
        help_text="Title message to display during maintenance (Russian)",
    )
    maintenance_message_az = models.CharField(
        max_length=255,
        blank=True,
        default="Tezliklə, Bizimlə Qalın!",
        verbose_name="Maintenance Message (AZ)",
        help_text="Title message to display during maintenance (Azerbaijani)",
    )
    maintenance_description_en = models.TextField(
        blank=True,
        default="Our website is under construction. We are working on something really amazing!",
        verbose_name="Maintenance Description (EN)",
        help_text="Description to display during maintenance (English)",
    )
    maintenance_description_ru = models.TextField(
        blank=True,
        default="Наш сайт находится в разработке. Мы работаем над чем-то действительно удивительным!",
        verbose_name="Maintenance Description (RU)",
        help_text="Description to display during maintenance (Russian)",
    )
    maintenance_description_az = models.TextField(
        blank=True,
        default="Veb saytımız hazırlanır. Biz həqiqətən heyrətamiz bir şey üzərində işləyirik!",
        verbose_name="Maintenance Description (AZ)",
        help_text="Description to display during maintenance (Azerbaijani)",
    )
    maintenance_message = models.TextField(
        blank=True,
        verbose_name="Maintenance Message (Legacy)",
        help_text="Legacy message field (use language-specific fields instead)",
    )
    maintenance_end_time = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="Maintenance End Time",
        help_text="Expected end time of maintenance",
    )

    # Performance Settings
    enable_caching = models.BooleanField(
        default=True,
        verbose_name="Enable Caching",
        help_text="Enable server-side caching",
    )
    cache_timeout = models.PositiveIntegerField(
        default=3600,
        verbose_name="Cache Timeout (seconds)",
        help_text="Cache timeout in seconds",
    )
    enable_image_optimization = models.BooleanField(
        default=True,
        verbose_name="Enable Image Optimization",
        help_text="Automatically optimize uploaded images",
    )

    # Notification Settings
    enable_email_notifications = models.BooleanField(
        default=True,
        verbose_name="Enable Email Notifications",
        help_text="Send email notifications to users",
    )
    enable_sms_notifications = models.BooleanField(
        default=False,
        verbose_name="Enable SMS Notifications",
        help_text="Send SMS notifications to users",
    )
    enable_push_notifications = models.BooleanField(
        default=False,
        verbose_name="Enable Push Notifications",
        help_text="Send push notifications to users",
    )

    # Legal & Compliance
    terms_url = models.URLField(
        blank=True,
        verbose_name="Terms & Conditions URL",
        help_text="Link to terms and conditions page",
    )
    privacy_url = models.URLField(
        blank=True,
        verbose_name="Privacy Policy URL",
        help_text="Link to privacy policy page",
    )
    cookie_policy_url = models.URLField(
        blank=True,
        verbose_name="Cookie Policy URL",
        help_text="Link to cookie policy page",
    )
    enable_cookie_consent = models.BooleanField(
        default=True,
        verbose_name="Enable Cookie Consent",
        help_text="Show cookie consent banner",
    )

    # Custom Scripts
    header_scripts = models.TextField(
        blank=True,
        verbose_name="Header Scripts",
        help_text="Custom scripts to inject in <head> (e.g., tracking codes)",
    )
    footer_scripts = models.TextField(
        blank=True,
        verbose_name="Footer Scripts",
        help_text="Custom scripts to inject before </body>",
    )

    def __str__(self):
        return f"Site Settings: {self.site_name}"

    def save(self, *args, **kwargs):
        """Ensure only one instance exists (Singleton pattern)"""
        if not self.pk and SiteSettings.objects.exists():
            raise ValueError(
                "Only one SiteSettings instance is allowed. Please edit the existing one."
            )
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"
