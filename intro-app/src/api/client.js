import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "../constants/constants.js";
import { LocalStorageService } from "../services/localstorage.js";
import { AuthService } from "../services/auth.js";

export const publicApiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        "Content-Type": "application/json",
    },
});

export const privateApiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        "Content-Type": "application/json",
    },
});

publicApiClient.interceptors.request.use((config) => {
    const language = LocalStorageService.get('lang');
    config.headers['Accept-Language'] = language;
    return config;
});

privateApiClient.interceptors.request.use((config) => {
    const language = LocalStorageService.get('lang');
    config.headers['Accept-Language'] = language;

    const token = AuthService.getAccessToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
});

privateApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = AuthService.getRefreshToken();
                if (refreshToken) {
                    const response = await publicApiClient.post('v2/users/auth/refresh/', {
                        refresh: refreshToken
                    });

                    const { access } = response.data;
                    AuthService.setTokens(access, refreshToken);

                    originalRequest.headers['Authorization'] = `Bearer ${access}`;
                    return privateApiClient(originalRequest);
                }
            } catch (refreshError) {
                AuthService.logout();
                window.location.href = '/auth/login';
            }
        }

        return Promise.reject(error);
    }
);