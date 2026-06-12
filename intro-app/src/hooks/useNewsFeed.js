import { useQuery } from "@tanstack/react-query";
import { NewsFeedAPI } from "../api/modules/news_feed.js";

export const useNewsFeedQuery = () => {
    return useQuery({
        queryKey: ["news_feed"],
        queryFn: NewsFeedAPI.getAll,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}