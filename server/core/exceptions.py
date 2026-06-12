from itertools import zip_longest
from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.exceptions import (
    APIException,
    AuthenticationFailed,
    ValidationError,
)
from .responses import ResponseBuilder


def _normalize(value, fallback: str) -> str:
    if isinstance(value, (dict, list, tuple)):
        return fallback
    return str(value)


def merge_validation_errors(details: dict, codes: dict):
    return {
        field: [
            {"code": code, "detail": message}
            for message, code in zip_longest(
                messages, codes.get(field, []), fillvalue=None
            )
        ]
        for field, messages in details.items()
    }


def exception_handler(exc, context):
    response = drf_exception_handler(exc, context)
    if response is None:
        return response
    detail = getattr(exc, "detail", str(exc))
    codes = getattr(exc, "get_codes", lambda: None)()
    status_code = getattr(exc, "status_code", 500)
    if isinstance(exc, ValidationError):
        return ResponseBuilder.error(
            detail=_normalize(detail, "Validation error."),
            code=_normalize(codes, "VALIDATION_ERROR").upper(),
            status_code=status_code,
            errors={"errors": merge_validation_errors(detail, codes)},
        ).raw()
    if isinstance(exc, AuthenticationFailed):
        return ResponseBuilder.error(
            detail=_normalize(detail, "Authentication failed."),
            code=_normalize(codes, "AUTHENTICATION_FAILED").upper(),
            status_code=status_code,
        ).raw()
    if isinstance(exc, APIException):
        return ResponseBuilder.error(
            detail=_normalize(detail, "API Exception."),
            code=_normalize(codes, "API_EXCEPTION").upper(),
            status_code=status_code,
        ).raw()
    return response
