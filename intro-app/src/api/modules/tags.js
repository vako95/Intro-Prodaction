import { publicApiClient } from "../client";

const TAGS_BASE_URL = "v2/blog/tags";
const CATEGORIES_BASE_URL = "v2/blog/categories";

export const TagsAPI = {
    async getAll() {
        try {
            const { data } = await publicApiClient.get(TAGS_BASE_URL);
            return data?.data || data || [];
        } catch (error) {
            throw error;
        }
    }
};

export const CategoriesAPI = {
    async getAll() {
        try {
            const { data } = await publicApiClient.get(CATEGORIES_BASE_URL);
            return data?.data || data || [];
        } catch (error) {
            throw error;
        }
    }
};
