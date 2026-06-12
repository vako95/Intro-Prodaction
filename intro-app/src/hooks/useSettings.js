import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHotelSettings, toggleMaintenanceMode } from '../api/modules/settings';

export const useSettings = () => {
    return useQuery({
        queryKey: ['hotelSettings'],
        queryFn: getHotelSettings,
        staleTime: 1000 * 60 * 60,
        retry: 3,
    });
};

export const useToggleMaintenance = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: toggleMaintenanceMode,
        onSuccess: (data) => {
            queryClient.setQueryData(['hotelSettings'], data);
        },
    });
};
