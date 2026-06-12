import { publicApiClient } from "../client";
import { API_ENDPOINTS } from "../../constants/constants.js";

export const QuoteApi = {
    async getAll(limit = 6) {
        const { data } = await publicApiClient.get(
            `${API_ENDPOINTS.quote.index}?page=1&limit=${limit}`
        );

        return data;
    }
};
