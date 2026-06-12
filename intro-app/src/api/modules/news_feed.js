import { API_ENDPOINTS, API_BASE_URL } from "../../constants/constants.js";
import { publicApiClient } from "../client.js";

const normalizeNewsFeedData = (item) => {
    if (!item) return null;

    const parseDate = (dateString) => {
        if (!dateString) {
            const now = new Date();
            return {
                day: now.getDate().toString().padStart(2, '0'),
                month: now.toLocaleString('en', { month: 'short' }),
                year: now.getFullYear().toString()
            };
        }

        const date = new Date(dateString);
        return {
            day: date.getDate().toString().padStart(2, '0'),
            month: date.toLocaleString('en', { month: 'short' }),
            year: date.getFullYear().toString()
        };
    };

    return {
        id: item.id,
        title: item.title || '',
        description: item.description || item.excerpt || '',
        excerpt: item.description || item.excerpt || '',
        poster: item.poster,
        image: item.poster,
        slug: item.slug || item.id,
        author: item.author?.username || item.author?.first_name || 'Admin',
        category: item.category?.title || 'News',
        date: parseDate(item.created_at)
    };
};

export const NewsFeedAPI = {
    async getAll() {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.news_feed.index,
                { params: { limit: 3 } }
            );
            
            const items = data?.data || data || [];
            
            if (!Array.isArray(items)) {
                return [];
            }
            
            return items.map(normalizeNewsFeedData).filter(Boolean);
        } catch (error) {
            throw error;
        }
    }
};
