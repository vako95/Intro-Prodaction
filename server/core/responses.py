import uuid
from datetime import datetime, timezone
from rest_framework import status
from rest_framework.response import Response


class ResponseBuilder:
    def __init__(
        self,
        *,
        success: bool = True,
        code: str | None = None,
        detail: str | None = None,
        data: dict | None = None,
        errors: dict | None = None,
        status_code=status.HTTP_200_OK,
    ):
        self.request_id = str(uuid.uuid4())
        self.timestamp = int(datetime.now(tz=timezone.utc).timestamp() * 1000)
        self.success_flag = success
        self.code = code
        self.detail = detail
        self.data = data
        self.errors = errors
        self.status_code = status_code

    def _full_payload(self) -> dict:
        payload = {
            "request_id": self.request_id,
            "timestamp": self.timestamp,
            "success": self.success_flag,
            "data": self.data,
            "errors": self.errors,
        }
        if self.code is not None:
            payload["code"] = self.code
        if self.detail is not None:
            payload["detail"] = self.detail
        return payload

    def _standard_payload(self) -> dict:
        payload = {
            "success": self.success_flag,
            "data": self.data,
            "errors": self.errors,
        }
        if self.code is not None:
            payload["code"] = self.code
        if self.detail is not None:
            payload["detail"] = self.detail
        return payload

    def _raw_payload(self) -> dict:
        payload = {
            "success": self.success_flag,
        }
        if self.data is not None:
            payload.update(self.data)
        if self.errors is not None:
            payload.update(self.errors)
        if self.code is not None:
            payload["code"] = self.code
        if self.detail is not None:
            payload["detail"] = self.detail
        return payload

    def full(self) -> Response:
        return Response(self._full_payload(), status=self.status_code)

    def standard(self) -> Response:
        return Response(self._standard_payload(), status=self.status_code)

    def raw(self) -> Response:
        return Response(self._raw_payload(), status=self.status_code)

    @classmethod
    def success(
        cls,
        *,
        code: str | None = None,
        detail: str | None = None,
        data: dict | None = None,
        status_code=status.HTTP_200_OK,
    ) -> "ResponseBuilder":
        return cls(
            success=True,
            code=code,
            detail=detail,
            data=data,
            errors=None,
            status_code=status_code,
        )

    @classmethod
    def error(
        cls,
        *,
        code: str | None = None,
        detail: str | None = None,
        errors: dict | None = None,
        status_code=status.HTTP_400_BAD_REQUEST,
    ) -> "ResponseBuilder":
        return cls(
            success=False,
            code=code,
            detail=detail,
            data=None,
            errors=errors,
            status_code=status_code,
        )
