import uuid
import os
from datetime import datetime

from typing import Callable
from functools import partial


def upload_to_factory(instance: object, filename: str, base_path: str, force_ext: str | None = None) -> str:
    ext = os.path.splitext(filename)[1].lower().lstrip(".")
    if ext != "svg" and force_ext:
        ext = force_ext
    path = datetime.now().strftime(f"{base_path}")
    filename_new = f"{uuid.uuid4()}.{ext}"
    return os.path.join(path, filename_new)


def upload_to(base_path: str, force_ext: str | None = None) -> Callable[[object, str], str]:
    return partial(upload_to_factory, base_path=base_path, force_ext=force_ext)
