import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "../api/unified.js";

export const useAuth = () => {
    const queryClient = useQueryClient();

    return {
        login: useMutation({
            mutationFn: ({ emailOrUsername, password }) => API.auth.login(emailOrUsername, password),
            onSuccess: () => {
                queryClient.invalidateQueries(["profile"]);
            }
        }),

        register: useMutation({
            mutationFn: (data) => API.auth.register(data),
            onSuccess: () => {
                queryClient.invalidateQueries(["profile"]);
            }
        }),

        logout: useMutation({
            mutationFn: () => API.auth.logout(),
            onSuccess: () => {
                queryClient.clear();
            }
        }),

        sendVerificationEmail: useMutation({
            mutationFn: (email) => API.auth.sendVerificationEmail(email)
        }),

        verifyEmail: useMutation({
            mutationFn: ({ email, code }) => API.auth.verifyEmail(email, code)
        }),

        requestPasswordReset: useMutation({
            mutationFn: (email) => API.auth.requestPasswordReset(email)
        }),

        confirmPasswordReset: useMutation({
            mutationFn: ({ email, code }) => API.auth.confirmPasswordReset(email, code)
        }),

        changePassword: useMutation({
            mutationFn: ({ currentPassword, newPassword }) => API.auth.changePassword(currentPassword, newPassword)
        })
    };
};

export const useProfile = () => {
    const queryClient = useQueryClient();

    return {
        query: useQuery({
            queryKey: ["profile"],
            queryFn: API.profile.get,
            staleTime: 5 * 60 * 1000
        }),

        update: useMutation({
            mutationFn: (data) => API.profile.update(data),
            onSuccess: () => {
                queryClient.invalidateQueries(["profile"]);
            }
        }),

        uploadAvatar: useMutation({
            mutationFn: (file) => API.profile.uploadAvatar(file),
            onSuccess: () => {
                queryClient.invalidateQueries(["profile"]);
            }
        })
    };
};

export const useOrders = (status = null) => {
    const queryClient = useQueryClient();

    return {
        query: useQuery({
            queryKey: ["orders", status],
            queryFn: () => API.orders.getAll(status)
        }),

        getById: (orderId) => useQuery({
            queryKey: ["orders", orderId],
            queryFn: () => API.orders.getById(orderId),
            enabled: Boolean(orderId)
        }),

        create: useMutation({
            mutationFn: (orderData) => API.orders.create(orderData),
            onSuccess: () => {
                queryClient.invalidateQueries(["orders"]);
            }
        }),

        cancel: useMutation({
            mutationFn: (orderId) => API.orders.cancel(orderId),
            onSuccess: () => {
                queryClient.invalidateQueries(["orders"]);
            }
        }),

        stats: useQuery({
            queryKey: ["orders", "stats"],
            queryFn: API.orders.getStats
        }),

        checkAvailability: useMutation({
            mutationFn: (availabilityData) => API.orders.checkAvailability(availabilityData)
        }),

        extendStay: useMutation({
            mutationFn: ({ orderId, newCheckOut }) => API.orders.extendStay(orderId, newCheckOut),
            onSuccess: () => {
                queryClient.invalidateQueries(["orders"]);
            }
        })
    };
};

export const useHeroSlider = () => {
    return useQuery({
        queryKey: ["hero_slider"],
        queryFn: API.modules.heroSlider.getAll
    });
};

export const useService = () => {
    return useQuery({
        queryKey: ["service"],
        queryFn: API.modules.service.getAll
    });
};

export const useSwap = () => {
    const queryClient = useQueryClient();

    return {
        query: useQuery({
            queryKey: ["swap"],
            queryFn: API.modules.swap.getAll
        }),

        getById: (id) => useQuery({
            queryKey: ["swap", id],
            queryFn: () => API.modules.swap.getById(id),
            enabled: Boolean(id)
        }),

        create: useMutation({
            mutationFn: (payload) => API.modules.swap.create(payload),
            onSuccess: () => {
                queryClient.invalidateQueries(["swap"]);
            }
        }),

        update: useMutation({
            mutationFn: ({ id, payload }) => API.modules.swap.update(id, payload),
            onSuccess: () => {
                queryClient.invalidateQueries(["swap"]);
            }
        }),

        delete: useMutation({
            mutationFn: (id) => API.modules.swap.delete(id),
            onSuccess: () => {
                queryClient.invalidateQueries(["swap"]);
            }
        })
    };
};

export const useAdvantagesBar = () => {
    return useQuery({
        queryKey: ["advantagesBar"],
        queryFn: API.modules.advantagesBar.getAll
    });
};

export const useFood = () => {
    return useQuery({
        queryKey: ["food"],
        queryFn: API.modules.food.getAll
    });
};

export const useRooms = (filters = {}) => {
    return useQuery({
        queryKey: ["rooms", filters],
        queryFn: () => API.modules.rooms.getAll(filters),
        enabled: true
    });
};

export const useRoomById = (id) => {
    return useQuery({
        queryKey: ["rooms", id],
        queryFn: () => API.modules.rooms.getById(id),
        enabled: Boolean(id)
    });
};

export const useRoomBySlug = (slug) => {
    return useQuery({
        queryKey: ["rooms", "slug", slug],
        queryFn: () => API.modules.rooms.getBySlug(slug),
        enabled: Boolean(slug)
    });
};

export const usePersonal = () => {
    return useQuery({
        queryKey: ["personal"],
        queryFn: API.modules.personal.getAll
    });
};

export const useNews = () => {
    return useQuery({
        queryKey: ["news"],
        queryFn: API.modules.news.getAll
    });
};

export const useNewsFeed = () => {
    return useQuery({
        queryKey: ["news_feed"],
        queryFn: API.modules.newsFeed.getAll
    });
};
