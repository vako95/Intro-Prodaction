import { privateApiClient } from "../client";

export const CheckoutApi = {
    /**
     * Create order from cart items
     * @param {Object} orderData - Order data
     * @param {Array} orderData.items - Cart items to order
     * @param {string} orderData.coupon_code - Optional coupon code
     * @param {string} orderData.notes - Optional order notes
     * @returns {Promise} Order data with order_number, total_amount, etc.
     */
    createOrder: async (orderData) => {
        const response = await privateApiClient.post("/v2/shop/checkout/create-order/", orderData);
        return response.data;
    },

    /**
     * Get list of user orders
     * @returns {Promise} List of orders
     */
    getOrders: async () => {
        const response = await privateApiClient.get("/v2/shop/checkout/orders/");
        return response.data;
    },

    /**
     * Get order details by order number
     * @param {string} orderNumber - Order number
     * @returns {Promise} Order details
     */
    getOrderDetail: async (orderNumber) => {
        const response = await privateApiClient.get(`/v2/shop/checkout/orders/${orderNumber}/`);
        return response.data;
    },

    /**
     * Create Stripe payment intent
     * @param {Object} paymentData - Payment data
     * @param {number} paymentData.order_id - Order ID
     * @param {string} paymentData.payment_method_id - Optional Stripe payment method ID
     * @returns {Promise} Payment intent with client_secret
     */
    createPaymentIntent: async (paymentData) => {
        const response = await privateApiClient.post("/v2/shop/checkout/create-payment-intent/", paymentData);
        return response.data;
    },

    /**
     * Confirm payment after Stripe processing
     * @param {Object} confirmData - Confirmation data
     * @param {string} confirmData.payment_intent_id - Stripe payment intent ID
     * @param {number} confirmData.order_id - Order ID
     * @returns {Promise} Payment confirmation
     */
    confirmPayment: async (confirmData) => {
        const response = await privateApiClient.post("/v2/shop/checkout/confirm-payment/", confirmData);
        return response.data;
    },
};
