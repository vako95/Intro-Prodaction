import { useQuery } from "@tanstack/react-query";
import { RoomsApi } from "../api/modules/rooms";

export const useRoomsQuery = (filters = {}) => {
    return useQuery({
        queryKey: ["rooms", filters],
        queryFn: () => RoomsApi.getAll(filters),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,
    })
}

