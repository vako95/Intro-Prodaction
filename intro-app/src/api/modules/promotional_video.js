import { publicApiClient } from "../client";
import { API_ENDPOINTS } from "../../constants/constants";

export const PromotionalVideoApi = {
    async get() {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.promotional_video
            );

            if (data?.data) {
                const video = data.data;
                
                return {
                    id: video.id,
                    title: video.title,
                    subtitle: video.subtitle,
                    videoUrl: video.youtube_url,
                    backgroundImage: video.background_image,
                    isActive: video.is_active,
                    order: video.order,
                };
            }

            return null;
        } catch (error) {
            throw error;
        }
    }
};
