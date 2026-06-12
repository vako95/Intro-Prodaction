import { LocalStorageService } from "./localstorage.js";

class AuthService {
    static setTokens(accessToken, refreshToken = null) {
        LocalStorageService.set('authToken', accessToken);
        if (refreshToken) {
            LocalStorageService.set('refreshToken', refreshToken);
        }
    }

    static getAccessToken() {
        return LocalStorageService.get('authToken');
    }

    static getRefreshToken() {
        return LocalStorageService.get('refreshToken');
    }

    static setUser(user) {
        LocalStorageService.set('user', user);
    }

    static getUser() {
        return LocalStorageService.get('user');
    }

    static isAuthenticated() {
        return !!this.getAccessToken();
    }

    static logout() {
        LocalStorageService.remove('authToken');
        LocalStorageService.remove('refreshToken');
        LocalStorageService.remove('user');
    }

    static clearAll() {
        this.logout();
    }
}

export { AuthService };
