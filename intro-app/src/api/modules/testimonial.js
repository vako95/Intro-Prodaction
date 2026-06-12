import { publicApiClient } from "../client";
import { API_ENDPOINTS } from "../../constants/constants";

export const TestimonialApi = {
    async getAll() {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.testimonial
            );

            if (data?.data && Array.isArray(data.data)) {
                return data.data.map(item => ({
                    id: item.id,
                    name: item.name,
                    role: item.role,
                    comment: item.comment,
                    image: item.image,
                    rating: item.rating,
                    isActive: item.is_active,
                    order: item.order,
                }));
            }

            return [];
        } catch (error) {
            throw error;
        }
    }
};
