import { publicApiClient } from "../client";
import { API_ENDPOINTS } from "../../constants/constants";

export const GalleryApi = {
    async getAll(params = {}) {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.gallery,
                { params }
            );

            if (data?.data && Array.isArray(data.data)) {
                return data.data.map(item => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    src: item.image,
                    image: item.image,
                    thumbnail: item.thumbnail || item.image,
                    category: item.category,
                    order: item.order,
                    isFeatured: item.is_featured,
                }));
            }

            return [];
        } catch (error) {
            throw error;
        }
    }
};
