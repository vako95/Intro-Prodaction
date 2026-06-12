import { publicApiClient } from "../client";
import { API_ENDPOINTS } from "../../constants/constants";

export const FaqApi = {
    async getAll(params = {}) {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.faq,
                { params }
            );

            if (data?.data && Array.isArray(data.data)) {
                return data.data.map(item => ({
                    id: item.id,
                    q: item.question || item.q,
                    a: item.answer || item.a,
                    order: item.order,
                }));
            }

            if (Array.isArray(data)) {
                return data.map(item => ({
                    id: item.id,
                    q: item.question || item.q,
                    a: item.answer || item.a,
                    order: item.order,
                }));
            }

            return [];
        } catch (error) {
            console.error("FAQ API Error:", error);
            throw error;
        }
    }
};
