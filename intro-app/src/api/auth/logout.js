import { privateApiClient } from "../client.js";
import { AuthService } from "../../services/auth.js";

const AUTH_BASE_URL = "v2/users/auth";

export const logoutAPI = {
    logout: async () => {
        const response = await privateApiClient.post(`${AUTH_BASE_URL}/logout/`);
        AuthService.logout();
        return response.data;
    }
};
