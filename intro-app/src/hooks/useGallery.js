import { useQuery } from "@tanstack/react-query";
import { GalleryApi } from "../api/modules/gallery";

export const useGalleryQuery = (params = {}) => {
    return useQuery({
        queryKey: ["gallery", params],
        queryFn: () => GalleryApi.getAll(params),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};
