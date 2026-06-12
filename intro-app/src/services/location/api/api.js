import { LOCATION_API_URL } from "../constants/constants";

export const fetchLocations = async () => {
    const response = await fetch(LOCATION_API_URL);
    if (!response.ok) throw new Error("Failed to fetch locations");
    return response.json();
};


export const fetchLocationById = async (id) => {
    const response = await fetch(`${LOCATION_API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch location");
    return response.json();
};
