import { privateApiClient } from "../client";

export const CouponApi = {
    async validate(code, orderAmount, roomId = null) {
        try {
            const { data } = await privateApiClient.post('v2/shop/coupons/validate/', {
                code: code.toUpperCase(),
                order_amount: orderAmount,
                room_id: roomId
            });
            return data;
        } catch (error) {
            throw error;
        }
    }
};
