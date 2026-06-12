import { publicApiClient } from "../client.js";
import { AuthService } from "../../services/auth.js";

const AUTH_BASE_URL = "v2/users/auth";

export const refreshAPI = {
    refreshToken: async (refreshToken) => {
        const response = await publicApiClient.post(`${AUTH_BASE_URL}/refresh/`, {
            refresh: refreshToken
        });
        
        if (response.data?.data?.access) {
            AuthService.setTokens(response.data.data.access, refreshToken);
        }
        
        return response.data;
    }
};
