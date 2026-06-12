export const getImageUrl = (imageData, baseUrl = '') => {
    if (!imageData) return null;
    
    if (typeof imageData === 'string') {
        if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
            return imageData;
        }
        return imageData.startsWith('/') ? `${baseUrl}${imageData}` : `${baseUrl}/${imageData}`;
    }
    
    if (typeof imageData === 'object') {
        const url = imageData.url || imageData.image || imageData.src;
        if (url) {
            return getImageUrl(url, baseUrl);
        }
    }
    
    return null;
};

export const getMultipleImages = (imagesData, baseUrl = '') => {
    if (!imagesData) return [];
    
    if (Array.isArray(imagesData)) {
        return imagesData
            .map(img => getImageUrl(img, baseUrl))
            .filter(Boolean);
    }
    
    return [];
};

export const getRoomImage = (room, baseUrl = '') => {
    const possibleFields = ['poster', 'cover', 'image', 'main_image', 'thumbnail'];
    
    for (const field of possibleFields) {
        const url = getImageUrl(room[field], baseUrl);
        if (url) return url;
    }
    
    return null;
};

export const getRoomImages = (room, baseUrl = '') => {
    const images = getMultipleImages(room.images, baseUrl);
    
    if (images.length === 0) {
        const mainImage = getRoomImage(room, baseUrl);
        if (mainImage) {
            images.push(mainImage);
        }
    }
    
    return images;
};
