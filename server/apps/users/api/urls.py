from django.urls import path
from .views import (
    LoginView,
    RegisterView,
    EmailVerificationView,
    EmailSendView,
    RefreshView,
    ProfileView,
    LogoutView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    PasswordResetChangeView,
)

urlpatterns = [
    path("auth/login/", LoginView.as_view()),
    path("auth/register/", RegisterView.as_view()),
    path("auth/email/send/", EmailSendView.as_view()),
    path("auth/email/verification/", EmailVerificationView.as_view()),
    path("auth/refresh/", RefreshView.as_view()),
    path("auth/profile/", ProfileView.as_view()),
    path("auth/logout/", LogoutView.as_view()),
    path("auth/reset/email/", PasswordResetRequestView.as_view()),
    path("auth/reset/confirm/", PasswordResetConfirmView.as_view()),
    path("auth/reset/change/", PasswordResetChangeView.as_view()),
]
