from django.urls import path
from .views import (
    RoomListView,
    RoomDetailView,
    RoomSearchView,
    RoomOrderCreateView,
    RoomOrderListView,
    RoomOrderDetailView,
    RoomOrderCancelView,
    RoomOrderDeleteView,
    RoomAvailabilityView,
    UserOrderStatsView,
    PromotionalVideoView,
    CouponValidateView,
    WishlistListView,
    WishlistAddView,
    WishlistRemoveView,
    WishlistToggleView,
    WishlistCheckView,
    WishlistBulkCheckView,
    CartView,
    AddToCartView,
    UpdateCartItemView,
    RemoveFromCartView,
    ClearCartView,
    CreateOrderView,
    OrderDetailView,
    CreatePaymentIntentView,
    ConfirmPaymentView,
    OrderListView,
)

urlpatterns = [
    path("rooms/", RoomListView.as_view(), name="room-list"),
    path("rooms/<slug:slug>/", RoomDetailView.as_view(), name="room-detail"),
    path("rooms/search/", RoomSearchView.as_view(), name="room-search"),
    path("orders/", RoomOrderListView.as_view(), name="order-list"),
    path("orders/create/", RoomOrderCreateView.as_view(), name="order-create"),
    path(
        "orders/<slug:order_slug>/", RoomOrderDetailView.as_view(), name="order-detail"
    ),
    path(
        "orders/<slug:order_slug>/cancel/",
        RoomOrderCancelView.as_view(),
        name="order-cancel",
    ),
    path(
        "orders/<slug:order_slug>/delete/",
        RoomOrderDeleteView.as_view(),
        name="order-delete",
    ),
    path("orders/stats/", UserOrderStatsView.as_view(), name="order-stats"),
    path("availability/", RoomAvailabilityView.as_view(), name="room-availability"),
    path(
        "promotional_video/", PromotionalVideoView.as_view(), name="promotional-video"
    ),
    path("coupons/validate/", CouponValidateView.as_view(), name="coupon-validate"),
    
    # Wishlist endpoints
    path("wishlist/", WishlistListView.as_view(), name="wishlist-list"),
    path("wishlist/add/", WishlistAddView.as_view(), name="wishlist-add"),
    path("wishlist/remove/<int:room_id>/", WishlistRemoveView.as_view(), name="wishlist-remove"),
    path("wishlist/toggle/", WishlistToggleView.as_view(), name="wishlist-toggle"),
    path("wishlist/check/<int:room_id>/", WishlistCheckView.as_view(), name="wishlist-check"),
    path("wishlist/check-bulk/", WishlistBulkCheckView.as_view(), name="wishlist-check-bulk"),
    
    # Cart endpoints
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/add/", AddToCartView.as_view(), name="cart-add"),
    path("cart/items/<int:pk>/", RemoveFromCartView.as_view(), name="cart-remove"),
    path("cart/items/<int:item_id>/update/", UpdateCartItemView.as_view(), name="cart-update"),
    path("cart/clear/", ClearCartView.as_view(), name="cart-clear"),
    
    # Checkout endpoints
    path("checkout/create-order/", CreateOrderView.as_view(), name="checkout-create-order"),
    path("checkout/orders/", OrderListView.as_view(), name="checkout-orders"),
    path("checkout/orders/<str:order_number>/", OrderDetailView.as_view(), name="checkout-order-detail"),
    path("checkout/create-payment-intent/", CreatePaymentIntentView.as_view(), name="checkout-create-payment-intent"),
    path("checkout/confirm-payment/", ConfirmPaymentView.as_view(), name="checkout-confirm-payment"),
]
