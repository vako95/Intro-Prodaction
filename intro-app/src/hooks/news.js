import { useQuery } from "@tanstack/react-query";
import { NewsAPI } from "../api/modules/news.js";

export const useNewsQuery = () => {
    return useQuery({
        queryKey: ["news"],
        queryFn: NewsAPI.getAll,
    })
}

export const useLatestNewsQuery = (limit = 4) => {
    return useQuery({
        queryKey: ["news", "latest", limit],
        queryFn: () => NewsAPI.getLatest(limit),
        staleTime: 5 * 60 * 1000,
    });
};

export const useNewsDetailQuery = (slug) => {
    return useQuery({
        queryKey: ["news", slug],
        queryFn: () => NewsAPI.getBySlug(slug),
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: !!slug,
    });
}