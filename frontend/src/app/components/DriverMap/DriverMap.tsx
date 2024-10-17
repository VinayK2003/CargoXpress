"use client";
import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { LatLngExpression } from "leaflet";

interface DriverProps {
    pickup: LatLngExpression;
    dropoff: LatLngExpression;
    driverLocation: { lat: number; lng: number };
}

const RoutingControl: React.FC<{ pickup: LatLngExpression; dropoff: LatLngExpression; }> = ({ pickup, dropoff }) => {
    const map = useMap();
    const routingControlRef = useRef<L.Routing.Control | null>(null);

    useEffect(() => {
        if (!map) return;

        routingControlRef.current = L.Routing.control({
            waypoints: [
                L.latLng(pickup),
                L.latLng(dropoff),
            ],
            routeWhileDragging: true,
            showAlternatives: false,
            addWaypoints: false,
            fitSelectedRoutes: true,
        }).addTo(map);

        // Clean up on unmount
        return () => {
            if (routingControlRef.current) {
                routingControlRef.current.remove();
                routingControlRef.current = null;
            }
        };
    }, [map, pickup, dropoff]);

    return null; // This component does not render anything itself
};

const DriverMap: React.FC<DriverProps> = ({ pickup, dropoff, driverLocation }) => {
    useEffect(() => {
        const defaultIcon = L.icon({
            iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
            iconRetinaUrl: '/icons/marker.png',
            shadowUrl: '/icons/marker.png.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41],
        });

        L.Marker.prototype.options.icon = defaultIcon;
    }, []);

    return (
        <MapContainer center={pickup} zoom={13} className="h-96">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={pickup}>
                <Popup>Pickup Location</Popup>
            </Marker>
            <Marker position={dropoff}>
                <Popup>Drop-off Location</Popup>
            </Marker>
            <Marker position={driverLocation}>
                <Popup>Driver's Location</Popup>
            </Marker>
            <RoutingControl pickup={pickup} dropoff={dropoff} />
        </MapContainer>
    );
};

export default DriverMap;