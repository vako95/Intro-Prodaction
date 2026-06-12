import { publicApiClient } from "../client";
import { API_ENDPOINTS, API_BASE_URL } from "../../constants/constants.js";

const normalizeNewsData = (item) => {
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
        description: item.description || item.content || item.excerpt || '',
        content: item.content || item.description || item.excerpt || '',
        excerpt: item.description || item.excerpt || item.content || '',
        poster: getFullUrl(item.poster || item.image || item.cover),
        image: getFullUrl(item.poster || item.image || item.cover),
        slug: item.slug || item.id,
        author: item.author || 'Admin',
        category: item.category || 'News',
        tag: item.tag || [],
        tags: item.tag || item.tags || [],
        comments: item.comments || [],
        comments_count: item.comments_count || 0,
        date: item.created_at || item.date || new Date().toISOString(),
        created_at: item.created_at || item.date || new Date().toISOString(),
        updated_at: item.updated_at || item.date || new Date().toISOString()
    };
};

export const NewsAPI = {
    async getAll() {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.news.index
            );

            const items = data?.data || data || [];
            if (!Array.isArray(items)) {
                return [];
            }

            return items.map(normalizeNewsData).filter(Boolean);
        } catch (error) {
            throw error;
        }
    },

    async getLatest(limit = 4) {
        try {
            const { data } = await publicApiClient.get(
                `${API_ENDPOINTS.modules.news.index}latest/`,
                { params: { limit } }
            );

            const items = data?.data || data || [];
            if (!Array.isArray(items)) {
                return [];
            }

            return items.map(normalizeNewsData).filter(Boolean);
        } catch (error) {
            throw error;
        }
    },

    async getBySlug(slug) {
        try {
            const url = `${API_ENDPOINTS.modules.news.index}${slug}/`;
            
            const { data } = await publicApiClient.get(url);

            const newsData = data?.data || data;
            return normalizeNewsData(newsData);
        } catch (error) {
            throw error;
        }
    }
};
