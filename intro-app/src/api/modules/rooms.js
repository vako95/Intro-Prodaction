import { publicApiClient } from "../client";
import { API_ENDPOINTS, API_BASE_URL } from "../../constants/constants";
import { getRoomImage, getRoomImages } from "../../utils/imageHelpers";

const normalizeRoomData = (room) => {
    if (!room) return null;

    const baseUrl = API_BASE_URL.replace('/api/', '');
    
    const mainImage = getRoomImage(room, baseUrl);
    const allImages = getRoomImages(room, baseUrl);

    // Обрабатываем icons/amenities с backend
    const icons = room.icons || [];
    const amenities = icons.map(icon => {
        if (typeof icon === 'string') {
            return { key: icon, label: icon };
        }
        if (typeof icon === 'object' && icon !== null) {
            return {
                id: icon.id,
                key: icon.key || icon.name || 'default',
                label: icon.label || icon.title || icon.name || icon.key || ''
            };
        }
        return null;
    }).filter(Boolean);

    // Сохраняем оригинальный массив images с id
    const roomImages = room.images && Array.isArray(room.images) 
        ? room.images.map(img => ({
            id: img.id,
            image: typeof img === 'string' ? img : (img.image || img.url || img.src)
          }))
        : [];

    return {
        // ID и slug
        id: room.id,
        slug: room.slug,
        
        // Текстовые поля с backend
        title: room.title || 'Untitled Room',
        subtitle: room.subtitle || '',
        excerpt: room.excerpt || '',
        description: room.description || room.excerpt || '',
        
        // Цены с backend
        price: room.price || 0,
        discount: room.discount || 0,
        final_price: room.final_price || room.price || 0,
        
        // Изображения с backend
        poster: mainImage,
        cover: mainImage,
        image: mainImage,
        main_image: mainImage,
        images: roomImages,
        gallery: allImages,
        
        // Вместимость с backend
        capacity_total: room.capacity_total || 0,
        capacity_adult: room.capacity_adult || 0,
        capacity_children: room.capacity_children || 0,
        capacity_child: room.capacity_children || 0,
        capacity: room.capacity_total || 0,
        
        // Доступность с backend
        room_count: room.room_count || 0,
        available_count: room.available_rooms || room.room_count || 0,
        available_rooms: room.available_rooms || room.room_count || 0,
        
        // Характеристики комнаты с backend
        size: room.size || 0,
        beds: room.beds || 0,
        view: room.view || '',
        
        amenities,
        icons: amenities,
        
        // Статусы с backend
        is_active: room.is_active,
        is_wishlisted: room.is_wishlisted,
        
        // Временные метки
        created_at: room.created_at,
        updated_at: room.updated_at,
    };
};

export const RoomsApi = {
    async getAll(filters = {}) {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.rooms.index,
                { params: filters }
            );

            let roomsData = [];
            
            if (data?.data && Array.isArray(data.data)) {
                roomsData = data.data;
            } else if (Array.isArray(data)) {
                roomsData = data;
            }
            
            return roomsData.map(normalizeRoomData).filter(Boolean);
        } catch (error) {
            throw error;
        }
    },

    async getById(id) {
        try {
            const { data } = await publicApiClient.get(
                `${API_ENDPOINTS.modules.rooms.index}${id}/`
            );

            // Если бэкенд возвращает массив (неправильное поведение бэкенда)
            if (Array.isArray(data)) {
                const room = data.find(r => r.id === parseInt(id));
                return room ? normalizeRoomData(room) : null;
            }

            // Если данные обернуты в data.data
            if (data?.data) {
                // Если это массив, ищем комнату по id
                if (Array.isArray(data.data)) {
                    const room = data.data.find(r => r.id === parseInt(id));
                    return room ? normalizeRoomData(room) : null;
                }
                // Если это один объект
                return normalizeRoomData(data.data);
            }

            return normalizeRoomData(data);
        } catch (error) {
            throw error;
        }
    },

    async getBySlug(slug) {
        try {
            const url = `${API_ENDPOINTS.modules.rooms.index}${slug}/`;
            
            const { data } = await publicApiClient.get(url);

            // Если бэкенд возвращает массив (неправильное поведение бэкенда)
            if (Array.isArray(data)) {
                const room = data.find(r => r.slug === slug);
                return room ? normalizeRoomData(room) : null;
            }

            // Если данные обернуты в data.data
            if (data?.data) {
                // Если это массив, ищем комнату по slug
                if (Array.isArray(data.data)) {
                    const room = data.data.find(r => r.slug === slug);
                    return room ? normalizeRoomData(room) : null;
                }
                // Если это один объект
                return normalizeRoomData(data.data);
            }

            return normalizeRoomData(data);
        } catch (error) {
            throw error;
        }
    }
};
