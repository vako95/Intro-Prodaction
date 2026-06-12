from rest_framework import serializers

from django.contrib.auth import get_user_model

from ....models import EmailPIN


User = get_user_model()


class EmailPinSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        user = attrs["user"]
        purpose = attrs["purpose"]
        target_code = attrs["pin"]

        try:
            confirm_pin = EmailPIN.objects.get(
                user=user,
                purpose=purpose,
                is_used=False,
            )

        except EmailPIN.DoesNotExist:
            raise serializers.ValidationError("Invalid PIN or already used")

        if confirm_pin.is_expires():
            raise serializers.ValidationError("PIN has expired")
        if confirm_pin.pin != target_code:
            raise serializers.ValidationError("Incorrect PIN code.")

        attrs["pin"] = confirm_pin
        return attrs

    class Meta:
        model = EmailPIN

        fields = (
            "user",
            "purpose",
            "pin",
        )
