import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { API } from '../api/unified';

export const useCoupon = () => {
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState(null);

    const validateMutation = useMutation({
        mutationFn: ({ code, orderAmount, roomId }) => 
            API.modules.coupon.validate(code, orderAmount, roomId),
        onSuccess: (response) => {
            if (response.success) {
                setAppliedCoupon(response.data);
                setCouponError(null);
                
                localStorage.setItem('appliedCoupon', JSON.stringify({
                    code: response.data.coupon.code,
                    discount_amount: response.data.discount_amount,
                    final_amount: response.data.final_amount,
                    timestamp: Date.now()
                }));
            } else {
                setCouponError(response.message || 'Invalid coupon');
                setAppliedCoupon(null);
            }
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Failed to validate coupon';
            setCouponError(message);
            setAppliedCoupon(null);
        }
    });

    const applyCoupon = useCallback((code, orderAmount, roomId = null) => {
        if (!code || !code.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }
        
        setCouponError(null);
        validateMutation.mutate({ code: code.trim(), orderAmount, roomId });
    }, [validateMutation]);

    const removeCoupon = useCallback(() => {
        setAppliedCoupon(null);
        setCouponError(null);
        localStorage.removeItem('appliedCoupon');
    }, []);

    const loadCouponFromStorage = useCallback(() => {
        try {
            const stored = localStorage.getItem('appliedCoupon');
            if (stored) {
                const couponData = JSON.parse(stored);
                if (Date.now() - couponData.timestamp < 3600000) {
                    return couponData;
                } else {
                    localStorage.removeItem('appliedCoupon');
                }
            }
        } catch (error) {
            localStorage.removeItem('appliedCoupon');
        }
        return null;
    }, []);

    return {
        appliedCoupon,
        couponError,
        isValidating: validateMutation.isPending,
        applyCoupon,
        removeCoupon,
        loadCouponFromStorage
    };
};
