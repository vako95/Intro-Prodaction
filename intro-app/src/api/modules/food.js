import { publicApiClient } from "../client";
import { API_ENDPOINTS, API_BASE_URL } from "../../constants/constants.js";

const normalizeFoodData = (item) => {
    if (!item) return null;

    const baseUrl = API_BASE_URL.replace('/api/', '');
    
    const getFullUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
    };

    return {
        ...item,
        id: item.id,
        title: item.title || '',
        subtitle: item.subtitle || '',
        desc: item.desc || item.description || '',
        description: item.desc || item.description || '',
        poster: getFullUrl(item.poster || item.image || item.cover),
        image: getFullUrl(item.poster || item.image || item.cover),
        price: item.price || 0,
        tag: item.tag || []
    };
};

export const FoodAPI = {
    async getAll() {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.food.index
            );
            
            const items = data?.data || data || [];
            
            if (!Array.isArray(items)) {
                return [];
            }
            
            return items.map(normalizeFoodData).filter(Boolean);
        } catch (error) {
            throw error;
        }
    },

    async getOne(id) {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.food.show(id)
            );
            
            const item = data?.data || data;
            return normalizeFoodData(item);
        } catch (error) {
            throw error;
        }
    }
};
