from .advantages_bar import AdvantagesBarListView
from .brand import BrandListView
from .category import CategoryListView
from .contact import ContactInquiryCreateView, HotelContactInfoView
from .domain import DomainListView
from .food import FoodListView
from .gallery import HotelGalleryListView, GalleryCategoryListView
from .hero_slider import HeroSliderListView
from .personal import PersonalListView, PersonalDetailView
from .service import ServiceListView
from .settings import SiteSettingsView, ToggleMaintenanceView
from .social import SocialListView
from .swap import SwapListView, SwapDetailView
from .tag import TagListView
from .testimonial import TestimonialListView
from .quote import QuoteListView
from .faq import FAQListView

from .review import (
    ReviewListView,
    ReviewCreateView,
    ReviewDeleteView,
    ReviewUpdateView,
)

from .newsletter import (
    NewsletterSubscribeView,
    NewsletterUnsubscribeView,
    NewsletterCheckView,
)
