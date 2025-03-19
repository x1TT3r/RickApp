import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';

function Map({ userLocation, supermarkets }) {
    const { latitude, longitude } = userLocation;

    // Configuração manual do ícone do marcador
    const marketIcon = L.icon({
        iconUrl: '/images/marker-icon.png', // o ícone padrão
        shadowUrl: '/images/marker-shadow.png', // Sombra do ícone
        iconSize: [25, 41], // Tamanho do ícone
        iconAnchor: [12, 41], // Posição da âncora
        popupAnchor: [1, -34], // Posição do popup
        shadowSize: [41, 41], // Tamanho da sombra
    });
    
    const userIcon = L.icon({
        iconUrl: '/images/red-marker-icon.png', // o ícone padrão
        shadowUrl: '/images/marker-shadow.png', // Sombra do ícone
        iconSize: [25, 41], // Tamanho do ícone
        iconAnchor: [12, 41], // Posição da âncora
        popupAnchor: [1, -34], // Posição do popup
        shadowSize: [41, 41], // Tamanho da sombra
    });

    return (
        <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
            className="leaflet-container"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Marcador da localização do usuário */}
            <Marker position={[latitude, longitude]} icon={userIcon}>
                <Popup>Sua localização</Popup>
            </Marker>

            {/* Marcadores dos supermercados */}
            {supermarkets.map((supermarket, index) => (
                <Marker
                    key={index}
                    position={[supermarket.lat, supermarket.lon]}
                    icon={marketIcon}
                >
                    <Popup>
                        {supermarket.display_name}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default Map;
