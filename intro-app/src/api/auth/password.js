import { publicApiClient, privateApiClient } from "../client.js";

const AUTH_BASE_URL = "v2/users/auth";

export const passwordAPI = {
    requestReset: async (email) => {
        const response = await publicApiClient.post(`${AUTH_BASE_URL}/reset/email/`, {
            email
        });
        return response.data;
    },

    confirmReset: async (email, pin) => {
        const response = await publicApiClient.post(`${AUTH_BASE_URL}/reset/confirm/`, {
            email,
            pin,
            purpose: "reset_password"
        });
        return response.data;
    },

    changePassword: async (email, token, newPassword) => {
        const response = await publicApiClient.post(`${AUTH_BASE_URL}/reset/change/`, {
            email,
            token,
            new_password: newPassword
        });
        return response.data;
    }
};
