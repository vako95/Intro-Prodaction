import { publicApiClient } from "../client.js";
import { AuthService } from "../../services/auth.js";

const AUTH_BASE_URL = "v2/users/auth";

export const loginAPI = {
    login: async (emailOrUsername, password) => {
        const isEmail = emailOrUsername.includes("@");

        const payload = {
            password: password
        };

        if (isEmail) {
            payload.email = emailOrUsername;
        } else {
            payload.username = emailOrUsername;
        }

        const response = await publicApiClient.post(`${AUTH_BASE_URL}/login/`, payload);

        if (response.data?.data) {
            const { access, refresh, user } = response.data.data;
            AuthService.setTokens(access, refresh);
            AuthService.setUser(user);
        }

        return response.data;
    }
};
