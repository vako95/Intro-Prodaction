import { privateApiClient } from "../client.js";
import { AuthService } from "../../services/auth.js";

const PROFILE_BASE_URL = "v2/users/auth";
const ORDERS_BASE_URL = "v2/shop";

export const profileAPI = {
    getProfile: async () => {
        const response = await privateApiClient.get(`${PROFILE_BASE_URL}/profile/`);
        if (response.data?.data) {
            AuthService.setUser(response.data.data);
        }
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await privateApiClient.post(`${PROFILE_BASE_URL}/profile/`, data);
        if (response.data?.data) {
            AuthService.setUser(response.data.data);
        }
        return response.data;
    },

    uploadAvatar: async (file) => {
        const formData = new FormData();
        formData.append("avatar", file);
        
        const response = await privateApiClient.post(
            `${PROFILE_BASE_URL}/profile/`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );
        if (response.data?.data) {
            AuthService.setUser(response.data.data);
        }
        return response.data;
    },

    deleteAvatar: async () => {
        const response = await privateApiClient.post(
            `${PROFILE_BASE_URL}/profile/`,
            {
                avatar: null
            }
        );
        if (response.data?.data) {
            AuthService.setUser(response.data.data);
        }
        return response.data;
    },

    changePassword: async (currentPassword, newPassword) => {
        const response = await privateApiClient.post(
            `${PROFILE_BASE_URL}/auth/reset/change/`,
            {
                current_password: currentPassword,
                new_password: newPassword
            }
        );
        return response.data;
    },

    getOrders: async (status = null) => {
        let url = `${ORDERS_BASE_URL}/orders/`;
        if (status) {
            url += `?status=${status}`;
        }
        const response = await privateApiClient.get(url);
        return response.data;
    },

    getOrderDetail: async (orderId) => {
        const response = await privateApiClient.get(`${ORDERS_BASE_URL}/orders/${orderId}/`);
        return response.data;
    },

    cancelOrder: async (orderId) => {
        const response = await privateApiClient.post(`${ORDERS_BASE_URL}/orders/${orderId}/cancel/`);
        return response.data;
    },

    getOrderStats: async () => {
        const response = await privateApiClient.get(`${ORDERS_BASE_URL}/orders/stats/`);
        return response.data;
    },

    createOrder: async (orderData) => {
        const response = await privateApiClient.post(
            `${ORDERS_BASE_URL}/orders/create/`,
            {
                room_id: orderData.room_id,
                check_in: orderData.check_in,
                check_out: orderData.check_out,
                adults: orderData.adults,
                children: orderData.children || 0,
                rooms_count: orderData.rooms_count || 1
            }
        );
        return response.data;
    },

    checkAvailability: async (availabilityData) => {
        const response = await privateApiClient.post(
            `${ORDERS_BASE_URL}/availability/`,
            {
                room_id: availabilityData.room_id,
                check_in: availabilityData.check_in,
                check_out: availabilityData.check_out,
                rooms_count: availabilityData.rooms_count || 1
            }
        );
        return response.data;
    },

    extendStay: async (orderId, newCheckOut) => {
        const orderResponse = await privateApiClient.get(`${ORDERS_BASE_URL}/orders/${orderId}/`);
        const existingOrder = orderResponse.data.data;

        const newOrderData = {
            room_id: existingOrder.room.id,
            check_in: existingOrder.check_out,
            check_out: newCheckOut,
            adults: existingOrder.adults,
            children: existingOrder.children,
            rooms_count: existingOrder.rooms_reserved
        };

        const response = await privateApiClient.post(
            `${ORDERS_BASE_URL}/orders/create/`,
            newOrderData
        );
        return response.data;
    }
};
