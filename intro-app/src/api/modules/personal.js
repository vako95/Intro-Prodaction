import { publicApiClient } from "../client";
import { API_ENDPOINTS, API_BASE_URL } from "../../constants/constants.js";

const normalizePersonalData = (item) => {
    if (!item) return null;

    const baseUrl = API_BASE_URL.replace('/api/', '');

    const getFullUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
    };

    // Normalize skills - check if skills exist, otherwise create from skill fields
    let skills = item.skills || [];

    // If no skills array but individual skill fields exist, create skills array
    if (skills.length === 0) {
        const skillFields = [];

        // Check for skill_1, skill_2, skill_3 pattern
        if (item.skill_1_name && item.skill_1_value) {
            skillFields.push({ name: item.skill_1_name, value: item.skill_1_value });
        }
        if (item.skill_2_name && item.skill_2_value) {
            skillFields.push({ name: item.skill_2_name, value: item.skill_2_value });
        }
        if (item.skill_3_name && item.skill_3_value) {
            skillFields.push({ name: item.skill_3_name, value: item.skill_3_value });
        }

        if (skillFields.length > 0) {
            skills = skillFields;
        }
    }

    return {
        ...item,
        id: item.id,
        name: item.name || '',
        role: item.role || item.position || '',
        position: item.role || item.position || '',
        bio: item.bio || '',
        description: item.bio || '',
        email: item.email || '',
        phone: item.phone || '',
        age: item.age || null,
        blood_group: item.blood_group || '',
        website: item.website || '',
        address: item.address || '',
        poster: getFullUrl(item.poster || item.image || item.avatar || item.photo),
        image: getFullUrl(item.poster || item.image || item.avatar || item.photo),
        avatar: getFullUrl(item.poster || item.image || item.avatar || item.photo),
        slug: item.slug || item.id,
        social: item.social || [],
        skills: skills
    };
};

export const PersonalAPI = {
    async getAll() {
        try {
            const { data } = await publicApiClient.get(
                API_ENDPOINTS.modules.personal.index
            );

            const items = data?.data || data || [];

            if (!Array.isArray(items)) {
                return [];
            }

            return items.map(normalizePersonalData).filter(Boolean);
        } catch (error) {
            throw error;
        }
    },

    async getBySlug(slug) {
        try {
            const { data } = await publicApiClient.get(
                `${API_ENDPOINTS.modules.personal.index}/${slug}/`
            );

            const memberData = data?.data || data;
            return normalizePersonalData(memberData);
        } catch (error) {
            throw error;
        }
    }
};
