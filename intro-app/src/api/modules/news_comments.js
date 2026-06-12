import { publicApiClient, privateApiClient } from "../client";

const NEWS_COMMENTS_BASE_URL = "v2/blog/news";

export const NewsCommentsAPI = {
    // Создать новый комментарий
    async create(newsId, message, parentId = null) {
        try {
            const payload = { message };
            if (parentId) {
                payload.parent = parentId;
            }
            
            const response = await privateApiClient.post(
                `${NEWS_COMMENTS_BASE_URL}/${newsId}/comments/`,
                payload
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Обновить комментарий
    async update(commentId, message) {
        try {
            const response = await privateApiClient.patch(
                `${NEWS_COMMENTS_BASE_URL}/comments/${commentId}/`,
                { message }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Удалить комментарий
    async delete(commentId) {
        try {
            const response = await privateApiClient.delete(
                `${NEWS_COMMENTS_BASE_URL}/comments/${commentId}/delete/`
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
