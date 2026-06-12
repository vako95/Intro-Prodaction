import { publicApiClient } from "../client.js";
import { AuthService } from "../../services/auth.js";

const AUTH_BASE_URL = "v2/users/auth";

export const registerAPI = {
    register: async (data) => {
        const response = await publicApiClient.post(`${AUTH_BASE_URL}/register/`, data);
        
        const responseData = response.data?.data || response.data;
        
        if (responseData?.access && responseData?.refresh) {
            AuthService.setTokens(responseData.access, responseData.refresh);
            if (responseData.user) {
                AuthService.setUser(responseData.user);
            }
        }
        
        return response.data;
    },

    sendVerificationEmail: async (email) => {
        const response = await publicApiClient.post(`${AUTH_BASE_URL}/email/send/`, {
            email
        });
        return response.data;
    },

    verifyEmail: async (email, code) => {
        const response = await publicApiClient.post(`${AUTH_BASE_URL}/email/verification/`, {
            email,
            code
        });
        return response.data;
    }
};
