import { publicApiClient, privateApiClient } from "./client.js";
import { AuthService } from "../services/auth.js";

const AUTH_BASE_URL = "v2/users/auth";
const ORDERS_BASE_URL = "v2/shop";

export const API = {
    auth: {
        login: async (emailOrUsername, password) => {
            const isEmail = emailOrUsername.includes("@");
            const payload = { password };
            if (isEmail) {
                payload.email = emailOrUsername;
            } else {
                payload.username = emailOrUsername;
            }
            const response = await publicApiClient.post(`${AUTH_BASE_URL}/login/`, payload);
            if (response.data?.data) {
                const { access, refresh, user } = response.data.data;
                AuthService.setTokens(access, refresh);
                AuthService.setUser(user);
            }
            return response.data;
        },

        register: async (data) => {
            const response = await publicApiClient.post(`${AUTH_BASE_URL}/register/`, data);
            if (response.data?.data) {
                const { access, refresh, user } = response.data.data;
                if (access && refresh) {
                    AuthService.setTokens(access, refresh);
                    AuthService.setUser(user);
                }
            }
            return response.data;
        },

        logout: async () => {
            const response = await privateApiClient.post(`${AUTH_BASE_URL}/logout/`);
            AuthService.logout();
            return response.data;
        },

        refreshToken: async (refreshToken) => {
            const response = await publicApiClient.post(`${AUTH_BASE_URL}/refresh/`, {
                refresh: refreshToken
            });
            if (response.data?.data?.access) {
                AuthService.setTokens(response.data.data.access, refreshToken);
            }
            return response.data;
        },

        sendVerificationEmail: async (email) => {
            const response = await publicApiClient.post(`${AUTH_BASE_URL}/email/send/`, { email });
            return response.data;
        },

        verifyEmail: async (email, code) => {
            const response = await publicApiClient.post(`${AUTH_BASE_URL}/email/verification/`, { email, code });
            return response.data;
        },

        requestPasswordReset: async (email) => {
            const response = await publicApiClient.post(`${AUTH_BASE_URL}/reset/email/`, { email });
            return response.data;
        },

        confirmPasswordReset: async (email, code) => {
            const response = await publicApiClient.post(`${AUTH_BASE_URL}/reset/confirm/`, { email, code });
            return response.data;
        },

        changePassword: async (currentPassword, newPassword) => {
            const response = await privateApiClient.post(`${AUTH_BASE_URL}/reset/change/`, {
                current_password: currentPassword,
                new_password: newPassword
            });
            return response.data;
        }
    },

    profile: {
        get: async () => {
            const response = await privateApiClient.get(`${AUTH_BASE_URL}/profile/`);
            if (response.data?.data) {
                AuthService.setUser(response.data.data);
            }
            return response.data;
        },

        update: async (data) => {
            const response = await privateApiClient.post(`${AUTH_BASE_URL}/profile/`, data);
            if (response.data?.data) {
                AuthService.setUser(response.data.data);
            }
            return response.data;
        },

        uploadAvatar: async (file) => {
            const formData = new FormData();
            formData.append("avatar", file);
            const response = await privateApiClient.post(`${AUTH_BASE_URL}/profile/`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (response.data?.data) {
                AuthService.setUser(response.data.data);
            }
            return response.data;
        }
    },

    orders: {
        getAll: async (status = null) => {
            let url = `${ORDERS_BASE_URL}/orders/`;
            if (status) url += `?status=${status}`;
            const response = await privateApiClient.get(url);
            return response.data;
        },

        getById: async (orderId) => {
            const response = await privateApiClient.get(`${ORDERS_BASE_URL}/orders/${orderId}/`);
            return response.data;
        },

        create: async (orderData) => {
            const response = await privateApiClient.post(`${ORDERS_BASE_URL}/orders/create/`, {
                room_id: orderData.room_id,
                check_in: orderData.check_in,
                check_out: orderData.check_out,
                adults: orderData.adults,
                children: orderData.children || 0,
                rooms_count: orderData.rooms_count || 1
            });
            return response.data;
        },

        cancel: async (orderId) => {
            const response = await privateApiClient.post(`${ORDERS_BASE_URL}/orders/${orderId}/cancel/`);
            return response.data;
        },

        getStats: async () => {
            const response = await privateApiClient.get(`${ORDERS_BASE_URL}/orders/stats/`);
            return response.data;
        },

        checkAvailability: async (availabilityData) => {
            const response = await privateApiClient.post(`${ORDERS_BASE_URL}/availability/`, {
                room_id: availabilityData.room_id,
                check_in: availabilityData.check_in,
                check_out: availabilityData.check_out,
                rooms_count: availabilityData.rooms_count || 1
            });
            return response.data;
        },

        extendStay: async (orderId, newCheckOut) => {
            const orderResponse = await privateApiClient.get(`${ORDERS_BASE_URL}/orders/${orderId}/`);
            const existingOrder = orderResponse.data.data;
            const response = await privateApiClient.post(`${ORDERS_BASE_URL}/orders/create/`, {
                room_id: existingOrder.room.id,
                check_in: existingOrder.check_out,
                check_out: newCheckOut,
                adults: existingOrder.adults,
                children: existingOrder.children,
                rooms_count: existingOrder.rooms_reserved
            });
            return response.data;
        }
    },

    modules: {
        heroSlider: {
            getAll: async () => {
                const { SliderHeroAPI } = await import('./modules/hero_slider.js');
                return SliderHeroAPI.getAll();
            }
        },

        service: {
            getAll: async () => {
                const { ServiceApi } = await import('./modules/service.js');
                return ServiceApi.getAll();
            }
        },

        swap: {
            getAll: async () => {
                const { SwapAPI } = await import('./modules/swap.js');
                return SwapAPI.getAll();
            },
            getById: async (id) => {
                const { SwapAPI } = await import('./modules/swap.js');
                return SwapAPI.getOne(id);
            },
            create: async (payload) => {
                const { SwapAPI } = await import('./modules/swap.js');
                return SwapAPI.create(payload);
            },
            update: async (id, payload) => {
                const { SwapAPI } = await import('./modules/swap.js');
                return SwapAPI.update(id, payload);
            },
            delete: async (id) => {
                const { SwapAPI } = await import('./modules/swap.js');
                return SwapAPI.delete(id);
            }
        },

        advantagesBar: {
            getAll: async () => {
                const { AdvantagesBarAPI } = await import('./modules/advantages_bar.js');
                return AdvantagesBarAPI.getAll();
            }
        },

        food: {
            getAll: async () => {
                const { FoodAPI } = await import('./modules/food.js');
                return FoodAPI.getAll();
            },
            getById: async (id) => {
                const { FoodAPI } = await import('./modules/food.js');
                return FoodAPI.getOne(id);
            }
        },

        rooms: {
            getAll: async (filters = {}) => {
                try {
                    const params = new URLSearchParams();
                    if (filters.check_in) params.append('check_in', filters.check_in);
                    if (filters.check_out) params.append('check_out', filters.check_out);
                    if (filters.adults) params.append('adults', filters.adults);
                    if (filters.children) params.append('children', filters.children);
                    if (filters.rooms_count) params.append('rooms_count', filters.rooms_count);
                    if (filters.min_price) params.append('min_price', filters.min_price);
                    if (filters.max_price) params.append('max_price', filters.max_price);
                    
                    const queryString = params.toString();
                    const url = queryString ? `v2/shop/rooms/?${queryString}` : "v2/shop/rooms/";
                    
                    const { data } = await publicApiClient.get(url);
                    
                    let roomsData = [];
                    
                    if (data?.data && Array.isArray(data.data)) {
                        roomsData = data.data;
                    } else if (Array.isArray(data)) {
                        roomsData = data;
                    }
                    
                    return roomsData.map(room => ({
                        ...room,
                        id: room.id,
                        name: room.title || room.name,
                        title: room.title || room.name,
                        image: room.poster || room.cover || room.image || room.main_image,
                        cover: room.poster || room.cover || room.image || room.main_image,
                        images: room.images || [],
                        price: room.final_price || room.price,
                        capacity: room.capacity_total || room.capacity_adult || 2,
                        size: room.size || 30,
                        beds: room.beds || 1,
                        available_rooms: room.available_count || room.room_count || 1,
                        amenities: room.icons?.map(icon => icon.label || icon.key) || [],
                        description: room.excerpt || room.description || '',
                        slug: room.slug
                    }));
                } catch (error) {
                    throw error;
                }
            },
            getById: async (id) => {
                try {
                    const { data } = await publicApiClient.get(`v2/shop/rooms/${id}/`);
                    
                    if (data?.data) {
                        const room = data.data;
                        return {
                            ...room,
                            id: room.id,
                            name: room.title || room.name,
                            title: room.title || room.name,
                            image: room.poster || room.cover || room.image || room.main_image,
                            cover: room.poster || room.cover || room.image || room.main_image,
                            images: room.images || [],
                            price: room.final_price || room.price,
                            slug: room.slug
                        };
                    }
                    
                    return data?.data;
                } catch (error) {
                    throw error;
                }
            },
            getBySlug: async (slug) => {
                try {
                    const { RoomsApi } = await import('./modules/rooms.js');
                    return RoomsApi.getBySlug(slug);
                } catch (error) {
                    throw error;
                }
            }
        },

        personal: {
            getAll: async () => {
                const { PersonalAPI } = await import('./modules/personal.js');
                return PersonalAPI.getAll();
            }
        },

        news: {
            getAll: async () => {
                const { NewsAPI } = await import('./modules/news.js');
                return NewsAPI.getAll();
            }
        },

        newsFeed: {
            getAll: async () => {
                const { NewsFeedAPI } = await import('./modules/news_feed.js');
                return NewsFeedAPI.getAll();
            }
        },

        coupon: {
            validate: async (code, orderAmount, roomId = null) => {
                const { CouponApi } = await import('./modules/coupon.js');
                return CouponApi.validate(code, orderAmount, roomId);
            }
        }
    }
};
