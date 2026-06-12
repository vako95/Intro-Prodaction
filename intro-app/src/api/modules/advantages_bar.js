import { publicApiClient } from "../client.js";
import { API_ENDPOINTS, API_BASE_URL } from "../../constants/constants.js";

const normalizeAdvantagesBarData = (item) => {
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
        icon: item.icon || '',
        poster: getFullUrl(item.poster || item.image),
        image: getFullUrl(item.poster || item.image)
    };
};

export const AdvantagesBarAPI = {
    async getAll() {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.advantages_bar.index
            );
            
            const items = data?.data || data || [];
            
            if (!Array.isArray(items)) {
                return [];
            }
            
            return items.map(normalizeAdvantagesBarData).filter(Boolean);
        } catch (error) {
            throw error;
        }
    },
};
