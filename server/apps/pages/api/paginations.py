from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
import math


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = "limit"
    max_page_size = 50

    def get_paginated_response(self, data):
        total_count = self.page.paginator.count

        page_size = self.get_page_size(self.request) or self.page_size
        total_pages = math.ceil(total_count / page_size)

        return Response(
            {
                "count": total_count,
                "limit": page_size,
                "total_pages": total_pages,
                "current_page": self.page.number,
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "results": data,
            }
        )
