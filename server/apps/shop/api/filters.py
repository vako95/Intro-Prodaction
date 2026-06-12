import django_filters
from ..models import Room
from django.db.models import F


class RoomFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(field_name="title", lookup_expr="icontains")
    capacity_adult = django_filters.NumberFilter(
        field_name="capacity_adult", lookup_expr="gte"
    )
    capacity_children = django_filters.NumberFilter(
        field_name="capacity_children", lookup_expr="gte"
    )
    room_count = django_filters.NumberFilter(field_name="room_count", lookup_expr="gte")
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    capacity_total = django_filters.NumberFilter(method="filter_capacity_total")
    check_in = django_filters.DateFilter(
        field_name="orders__check_in", lookup_expr="lte"
    )
    check_out = django_filters.DateFilter(
        field_name="orders__check_out", lookup_expr="gte"
    )
    availability = django_filters.BooleanFilter(
        method="filter_availability", label="Available"
    )

    def filter_availability(self, queryset, name, value):
        check_in = self.data.get("check_in")
        check_out = self.data.get("check_out")
        if check_in and check_out:
            queryset = queryset.exclude(
                orders__check_in__lt=check_out, orders__check_out__gt=check_in
            )
        return queryset

    def filter_capacity_total(self, queryset, name, value):
        return queryset.annotate(
            total_capacity=F("capacity_adult") + F("capacity_children")
        ).filter(total_capacity__gte=value)

    class Meta:
        model = Room
        fields = {
            "price": ["gte", "lte"],
            "capacity_adult": ["gte"],
            "capacity_children": ["gte"],
            "room_count": ["gte"],
            "title": ["icontains"],
        }

    class Meta:
        model = Room
        fields = {
            "price": ["gte", "lte"],
            "capacity_adult": ["gte"],
            "capacity_children": ["gte"],
            "room_count": ["gte"],
            "title": ["icontains"],
        }
