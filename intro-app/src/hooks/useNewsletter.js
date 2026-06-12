import { useMutation, useQuery } from "@tanstack/react-query";
import { NewsletterAPI } from "../api/modules/newsletter";

/**
 * Hook for newsletter subscription
 */
export const useNewsletterSubscribe = () => {
    return useMutation({
        mutationFn: (email) => NewsletterAPI.subscribe(email)
    });
};

/**
 * Hook for newsletter unsubscription
 */
export const useNewsletterUnsubscribe = () => {
    return useMutation({
        mutationFn: (email) => NewsletterAPI.unsubscribe(email)
    });
};

/**
 * Hook to check newsletter subscription status
 * @param {string} email - Email to check
 * @param {boolean} enabled - Whether to enable the query
 */
export const useNewsletterCheck = (email, enabled = false) => {
    return useQuery({
        queryKey: ['newsletter', 'check', email],
        queryFn: () => NewsletterAPI.checkSubscription(email),
        enabled: enabled && !!email,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });
};
