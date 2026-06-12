import { privateApiClient } from "../client";
import { API_BASE_URL } from "../../constants/constants";

const WISHLIST_BASE = "/v2/shop/wishlist";

const normalizeWishlistData = (items) => {
    if (!items || !Array.isArray(items)) return [];
    
    const baseUrl = API_BASE_URL.replace('/api/', '');
    
    const getFullUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
    };

    return items.map(item => {
        if (!item || !item.room) return item;
        
        return {
            ...item,
            room: {
                ...item.room,
                poster: getFullUrl(item.room.poster),
                cover: getFullUrl(item.room.cover),
                gallery: item.room.gallery?.map(img => ({
                    ...img,
                    image: getFullUrl(img.image),
                    thumbnail: getFullUrl(img.thumbnail)
                })) || []
            }
        };
    });
};

export const WishlistApi = {
    async getAll() {
        try {
            const { data } = await privateApiClient.get(`${WISHLIST_BASE}/`);
            return normalizeWishlistData(data);
        } catch (error) {
            throw error;
        }
    },

    async add(roomId) {
        try {
            const { data } = await privateApiClient.post(`${WISHLIST_BASE}/add/`, {
                room_id: roomId
            });
            return data;
        } catch (error) {
            throw error;
        }
    },

    async remove(roomId) {
        try {
            const { data } = await privateApiClient.delete(`${WISHLIST_BASE}/remove/${roomId}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async toggle(roomId) {
        try {
            const { data } = await privateApiClient.post(`${WISHLIST_BASE}/toggle/`, {
                room_id: roomId
            });
            return data;
        } catch (error) {
            throw error;
        }
    },

    async check(roomId) {
        try {
            const { data } = await privateApiClient.get(`${WISHLIST_BASE}/check/${roomId}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async checkBulk(roomIds) {
        try {
            const { data } = await privateApiClient.post(`${WISHLIST_BASE}/check-bulk/`, {
                room_ids: roomIds
            });
            return data;
        } catch (error) {
            throw error;
        }
    }
};
