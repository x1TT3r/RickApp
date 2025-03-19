import React, { useState, useEffect } from "react";

function Geolocation({ onLocationObtained }) {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocalização não é suportada pelo navegador.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                setLocation(coords);
                onLocationObtained(coords);
            },
            (err) => {
                setError("Erro ao obter a localização: " + err.message);
            }
        );
    }, [onLocationObtained]);

    if (error) return <p>{error}</p>;
    if (!location) return <p>Obtendo localização...</p>;

    return <p>Localização: {location.latitude}, {location.longitude}</p>;
}

export default Geolocation;
