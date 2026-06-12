import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewsCommentsAPI } from "../api/modules/news_comments";

export const useCreateCommentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ newsId, message, parentId }) => 
            NewsCommentsAPI.create(newsId, message, parentId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(["news", variables.newsId]);
        },
    });
};

export const useUpdateCommentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId, message }) => 
            NewsCommentsAPI.update(commentId, message),
        onSuccess: () => {
            queryClient.invalidateQueries(["news"]);
        },
    });
};

export const useDeleteCommentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId) => 
            NewsCommentsAPI.delete(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries(["news"]);
        },
    });
};
