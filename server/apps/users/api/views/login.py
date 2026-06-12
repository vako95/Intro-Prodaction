from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.request import Request
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from ..serializers import LoginSerializer
from core.responses import ResponseBuilder

User = get_user_model()


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        access = serializer.validated_data["access"]
        refresh = serializer.validated_data["refresh"]
        
        # Get user from refresh token
        user = None
        try:
            refresh_token = RefreshToken(refresh)
            user_id = refresh_token.get('user_id')
            if user_id:
                user = User.objects.get(id=user_id)
        except Exception as e:
            print(f"Error getting user from token: {e}")
        
        # Fallback: try to get user from email or username
        if not user:
            email = request.data.get('email')
            username = request.data.get('username')
            
            if email:
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    pass
            elif username:
                try:
                    user = User.objects.get(username=username)
                except User.DoesNotExist:
                    pass
        
        user_data = None
        if user:
            user_data = {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "phone": getattr(user, 'phone', ''),
                "address": getattr(user, 'address', ''),
                "country": getattr(user, 'country', ''),
                "avatar": str(user.avatar.url) if hasattr(user, 'avatar') and user.avatar else None,
                "date_of_birth": str(user.date_of_birth) if hasattr(user, 'date_of_birth') and user.date_of_birth else None,
                "gender": getattr(user, 'gender', ''),
                "is_email_verified": getattr(user, 'is_email_verified', False),
                "created_at": user.created_at.isoformat() if hasattr(user, 'created_at') else None,
                "updated_at": user.updated_at.isoformat() if hasattr(user, 'updated_at') else None,
            }
        
        response = ResponseBuilder.success(
            detail="Logged in successfully.",
            data={
                "access": access,
                "refresh": refresh,
                "user": user_data
            },
        ).standard()

        refresh_lifetime = settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]

        response.set_cookie(
            key="refresh",
            value=refresh,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=int(refresh_lifetime.total_seconds()),
        )

        return response
