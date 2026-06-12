import { publicApiClient } from "../client";
import { API_ENDPOINTS, API_BASE_URL } from "../../constants/constants";

const normalizeServiceData = (item) => {
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
        description: item.description || item.desc || '',
        poster: getFullUrl(item.poster || item.image || item.cover),
        image: getFullUrl(item.poster || item.image || item.cover),
        video: item.video ? getFullUrl(item.video) : null
    };
};

export const ServiceApi = {
    async getAll() {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.service.index
            );
            
            const serviceData = data?.data || data;
            
            if (!serviceData) {
                return [];
            }
            
            if (Array.isArray(serviceData)) {
                return serviceData.map(normalizeServiceData).filter(Boolean);
            }
            
            return [normalizeServiceData(serviceData)].filter(Boolean);
        } catch (error) {
            throw error;
        }
    },

    async getRaw() {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.service.index
            );
            
            return data?.data || null;
        } catch (error) {
            throw error;
        }
    }
};
