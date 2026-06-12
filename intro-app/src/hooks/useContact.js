import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHotelContactInfo, createContactInquiry } from '../api/modules/contact';

/**
 * Hook для получения контактной информации отеля
 */
export const useHotelContactInfo = () => {
    return useQuery({
        queryKey: ['hotelContactInfo'],
        queryFn: getHotelContactInfo,
        staleTime: 1000 * 60 * 60, // 1 час
    });
};

/**
 * Hook для отправки обращения через форму контактов
 */
export const useCreateContactInquiry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createContactInquiry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contactInquiries'] });
        },
    });
};
