import { publicApiClient } from "../client";

export const ReviewApi = {
    async getAll() {
        try {
            const { data } = await publicApiClient.get("review/list/");

            if (data?.data && Array.isArray(data.data)) {
                return data.data.map(item => ({
                    id: item.id,
                    message: item.message,
                    averageRating: item.average_rating,
                    author: item.author,
                    createdAt: item.created_at,
                }));
            }

            return [];
        } catch (error) {
            throw error;
        }
    },

    async create(reviewData) {
        try {
            const { data } = await publicApiClient.post("review/create/", reviewData);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async update(slug, reviewData) {
        try {
            const { data } = await publicApiClient.patch(`review/${slug}/`, reviewData);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async delete(slug) {
        try {
            const { data } = await publicApiClient.delete(`review/${slug}/delete/`);
            return data;
        } catch (error) {
            throw error;
        }
    }
};
