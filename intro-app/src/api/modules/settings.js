import { publicApiClient, privateApiClient } from '../client';

export const getHotelSettings = async () => {
    const response = await publicApiClient.get('/settings/');
    return response.data;
};

export const toggleMaintenanceMode = async () => {
    const response = await privateApiClient.post('/settings/maintenance/toggle/');
    return response.data;
};
