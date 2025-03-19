// Função de filtragem
export function filterByRadius(supermarkets, userLocation, radius) {
    const { latitude, longitude } = userLocation;

    return supermarkets.filter((supermarket) => {
        const distance = haversineDistance(
            [latitude, longitude],
            [parseFloat(supermarket.lat), parseFloat(supermarket.lon)]
        );
        return distance <= radius; // Retorna apenas os que estão no raio
    });
}

// Cálculo da distância Haversine
export function haversineDistance(coords1, coords2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Raio médio da Terra em km
    const [lat1, lon1] = coords1;
    const [lat2, lon2] = coords2;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Retorna a distância em metros
}