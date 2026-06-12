export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/";
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;

export const API_ENDPOINTS = {
    modules: {
        hero_slider: {
            index: "hero_slider",
            show: (uid) => `hero_slider/${uid}`,
            store: "hero_slider",
            update: (uid) => `hero_slider/${uid}`,
            destroy: (uid) => `hero_slider/${uid}`
        },
        service: {
            index: "service/",
            show: (uid) => `service/${uid}/`,
            store: "service/",
            update: (uid) => `service/${uid}/`,
            destroy: (uid) => `service/${uid}/`
        },
        swap: {
            index: "swap",
            show: (uid) => `swap/${uid}`,
            store: "swap",
            update: (uid) => `swap/${uid}`,
            destroy: (uid) => `swap/${uid}`
        },
        advantages_bar: {
            index: "advantages_bar",
            show: (uid) => `advantages_bar/${uid}`,
            store: "advantages_bar",
            update: (uuid) => `advantages_bar/${uuid}`,
            destroy: (uuid) => `advantages_bar/${uuid}`
        },
        food: {
            index: "food",
            show: (uid) => `food/${uid}`,
            store: "food",
            update: (uid) => `food/${uid}`,
            destroy: (uid) => `food/${uid}`
        },
        rooms: {
            index: "v2/shop/rooms/",
            show: (uid) => `v2/shop/rooms/${uid}/`,
            store: "v2/shop/rooms/",
            update: (uid) => `v2/shop/rooms/${uid}/`,
            destroy: (uid) => `v2/shop/rooms/${uid}/`
        },
        personal: {
            index: "personal",
            show: (uid) => `personal/${uid}`,
            store: "personal",
            update: (uid) => `personal/${uid}`,
            destroy: (uid) => `personal/${uid}`
        },
        news: {
            index: "v2/blog/news/",
            show: (uid) => `blog/news//${uid}`,
            store: "news",
            update: (uid) => `blog/news/${uid}`,
            destroy: (uid) => `blog/news/${uid}`
        },
        news_feed: {
            index: "v2/blog/news/latest/",
            show: (uid) => `v2/blog/news/${uid}/`,
        },
        newsletter: {
            subscribe: "newsletter/subscribe/",
            unsubscribe: "newsletter/unsubscribe/",
            check: "newsletter/check/"
        },
        testimonial: "testimonial/",
        gallery: "gallery/",
        promotional_video: "v2/shop/promotional_video/",
        faq: "faq/",
        review: {
            index: "review/list/",
            show: (slug) => `review/${slug}/`,
            store: "review/create/",
            update: (slug) => `review/${slug}/`,
            destroy: (slug) => `review/${slug}/delete/`
        },
    },
    quote: {
        index: "quote",
        show: (uid) => `quote/${uid}`,
        store: "quote",
        update: (uid) => `quote/${uid}`,
        destroy: (uid) => `quote/${uid}`
    }
};