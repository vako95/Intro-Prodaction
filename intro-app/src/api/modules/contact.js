import { publicApiClient } from '../client';

/**
 * Получить контактную информацию отеля
 */
export const getHotelContactInfo = async () => {
    const response = await publicApiClient.get('/contact/info/');
    return response.data;
};

/**
 * Отправить обращение через форму контактов
 */
export const createContactInquiry = async (data) => {
    const response = await publicApiClient.post('/contact/inquiry/', data);
    return response.data;
};
