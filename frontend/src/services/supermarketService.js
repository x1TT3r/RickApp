import axios from "axios";

export const searchNearbySupermarkets = async ({ latitude, longitude, radius }) => {
    try {
        const response = await axios.get("http://localhost:5000/api/nearby-supermarkets", {
            params: {
                lat: latitude,
                lon: longitude,
                radius: radius, // Raio em metros
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar supermercados:", error);
        return [];
    }
};
