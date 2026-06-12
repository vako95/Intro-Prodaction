import { publicApiClient } from "../client";
import { API_ENDPOINTS } from "../../constants/constants.js";

export const NewsletterAPI = {
    /**
     * Subscribe to newsletter
     * @param {string} email - Email address
     * @returns {Promise} API response
     */
    async subscribe(email) {
        try {
            const { data } = await publicApiClient.post(
                API_ENDPOINTS.modules.newsletter.subscribe,
                { email }
            );
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Unsubscribe from newsletter
     * @param {string} email - Email address
     * @returns {Promise} API response
     */
    async unsubscribe(email) {
        try {
            const { data } = await publicApiClient.post(
                API_ENDPOINTS.modules.newsletter.unsubscribe,
                { email }
            );
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Check if email is subscribed
     * @param {string} email - Email address
     * @returns {Promise} API response
     */
    async checkSubscription(email) {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.newsletter.check,
                { params: { email } }
            );
            return data;
        } catch (error) {
            throw error;
        }
    }
};
