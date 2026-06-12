from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from ..serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from core.responses import ResponseBuilder

User = get_user_model()


class RegisterView(APIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)
        refresh_str = str(refresh)
        
        # Prepare user data
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
        
        return ResponseBuilder.success(
            data={
                "message": "User registered successfully, please check your email",
                "access": access,
                "refresh": refresh_str,
                "user": user_data
            },
            status_code=status.HTTP_201_CREATED,
        ).raw()
