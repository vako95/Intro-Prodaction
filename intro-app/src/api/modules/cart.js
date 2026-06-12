import { privateApiClient } from "../client";

const CART_BASE = "/v2/shop/cart";

export const CartApi = {
    /**
     * Получить корзину
     * @returns {Promise<Object>}
     */
    async getCart() {
        try {
            const { data } = await privateApiClient.get(`${CART_BASE}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Добавить в корзину
     * @param {Object} cartData
     * @returns {Promise<Object>}
     */
    async addToCart(cartData) {
        try {
            const { data } = await privateApiClient.post(`${CART_BASE}/add/`, cartData);
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Обновить cart item
     * @param {number} itemId
     * @param {Object} updates
     * @returns {Promise<Object>}
     */
    async updateCartItem(itemId, updates) {
        try {
            const { data } = await privateApiClient.patch(
                `${CART_BASE}/items/${itemId}/update/`,
                updates
            );
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Удалить из корзины
     * @param {number} itemId
     * @returns {Promise<Object>}
     */
    async removeFromCart(itemId) {
        try {
            const { data } = await privateApiClient.delete(`${CART_BASE}/items/${itemId}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Очистить корзину
     * @returns {Promise<Object>}
     */
    async clearCart() {
        try {
            const { data } = await privateApiClient.post(`${CART_BASE}/clear/`);
            return data;
        } catch (error) {
            throw error;
        }
    }
};
