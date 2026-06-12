from django.core.exceptions import ValidationError


class SVGValidator:
    def __call__(self, file):
        if not file.name.lower().endswith(".svg"):
            return file
        try:
            file.seek(0)
            content = file.read().decode("utf-8", errors="ignore")
            dangerous_tags = [
                "<script",
                "javascript:",
                "onerror=",
                "onload=",
                "onclick=",
            ]
            content_lower = content.lower()

            for tag in dangerous_tags:
                if tag in content_lower:
                    raise ValidationError(
                        f"SVG must not contain potentially dangerous content: {tag}"
                    )
            file.seek(0)
        except ValidationError:
            raise
        except Exception as e:
            raise ValidationError(f"Invalid SVG file: {str(e)}")
        finally:
            file.seek(0)

    def deconstruct(self):
        return ("apps.pages.utils.validators.SVGValidator", [], {})
