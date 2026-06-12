import { publicApiClient } from "../client";
import { API_ENDPOINTS, API_BASE_URL } from "../../constants/constants";

const normalizeSliderData = (item) => {
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
        poster: getFullUrl(item.poster || item.image || item.cover),
        image: getFullUrl(item.poster || item.image || item.cover),
        brand: item.brand ? {
            ...item.brand,
            logo: getFullUrl(item.brand.logo)
        } : null
    };
};

export const SliderHeroAPI = {
    async getAll() {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.hero_slider.index
            );
            
            const items = data?.data || data || [];
            
            if (!Array.isArray(items)) {
                return [];
            }
            
            return items.map(normalizeSliderData).filter(Boolean);
        } catch (error) {
            throw error;
        }
    },
};
