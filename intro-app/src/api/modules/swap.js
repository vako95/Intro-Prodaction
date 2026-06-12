import { publicApiClient } from "../client";
import { API_ENDPOINTS, API_BASE_URL } from "../../constants/constants.js";

const normalizeSwapData = (item) => {
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
        slug: item.slug,
        label: item.label || '',
        title: item.title || '',
        subtitle: item.subtitle || '',
        content: item.content || item.description || item.desc || '',
        description: item.description || item.desc || item.content || '',
        poster: getFullUrl(item.poster || item.image || item.cover),
        image: getFullUrl(item.poster || item.image || item.cover),
        images: item.images ? item.images.map(img => getFullUrl(img)).filter(Boolean) : [],
        date: item.date || '',
        location: item.location || '',
        duration: item.duration || ''
    };
};

export const SwapAPI = {
    async getAll() {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.swap.index
            );
            
            const items = data?.data || data || [];
            
            if (!Array.isArray(items)) {
                return [];
            }
            
            return items.map(normalizeSwapData).filter(Boolean);
        } catch (error) {
            throw error;
        }
    },

    async getOne(slug) {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.swap.show(slug)
            );
            
            const item = data?.data || data;
            return normalizeSwapData(item);
        } catch (error) {
            throw error;
        }
    },

    async create(payload) {
        try {
            const { data } = await publicApiClient.post(
                API_ENDPOINTS.modules.swap.store,
                payload
            );
            return data;
        } catch (error) {
            throw error;
        }
    },

    async update(id, payload) {
        try {
            const { data } = await publicApiClient.put(
                API_ENDPOINTS.modules.swap.update(id),
                payload
            );
            return data;
        } catch (error) {
            throw error;
        }
    },

    async delete(id) {
        try {
            const { data } = await publicApiClient.delete(
                API_ENDPOINTS.modules.swap.destroy(id)
            );
            return data;
        } catch (error) {
            throw error;
        }
    },
};
