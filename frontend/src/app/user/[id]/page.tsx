"use client"
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { LatLngExpression } from "leaflet";
import 'leaflet-control-geocoder';

interface Suggestion {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

const RoutingMachine: React.FC<{ pickup: L.LatLngExpression; dropoff: L.LatLngExpression }> = ({ pickup, dropoff }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(pickup),
                L.latLng(dropoff)
            ],
            routeWhileDragging: true,
            showAlternatives: false,
            addWaypoints: false,
            fitSelectedRoutes: true,
        }).addTo(map);

        return () => {
            map.removeControl(routingControl);
        };
    }, [map, pickup, dropoff]);

    return null;
};

const User: React.FC = () => {
    const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [dropoffLocation, setDropoffLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
    const [carType, setCarType] = useState<'sedan' | 'suv' | 'truck' | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [pickupAddress, setPickupAddress] = useState<string>('');
    const [dropoffAddress, setDropoffAddress] = useState<string>('');
    const [pickupSuggestions, setPickupSuggestions] = useState<Suggestion[]>([]);
    const [dropoffSuggestions, setDropoffSuggestions] = useState<Suggestion[]>([]);
    const pickupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dropoffTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const defaultIcon = L.icon({
            iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
            iconRetinaUrl: '/icons/marker.png',
            shadowUrl: '/icons/marker.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        });

        L.Marker.prototype.options.icon = defaultIcon;
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    const handleBooking = async () => {
        if (!pickupLocation || !dropoffLocation || !carType || estimatedPrice === null) {
            alert("Please fill in all details before booking.");
            return;
        }

        const bookingData = {
            pickupLocation,
            dropoffLocation,
            carType,
            estimatedPrice,
            pickupAddress,
            dropoffAddress,
            // bookingId: Math.random().toString(36).substr(2, 9), // Generate a random booking ID
        };
        console.log(bookingData)

        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });
            if (!response.ok) {
                throw new Error('Error creating booking');
            }
            
            const data = await response.json();
            console.log(data);
            alert('Booking successful! Waiting for a driver to accept.');
            setPickupLocation(null);
            setDropoffLocation(null);
            setCarType(null);
            setEstimatedPrice(null);
            setPickupAddress('');
            setDropoffAddress('');
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('There was an error creating your booking. Please try again.');
        }
    };

    const pricingModel: Record<'sedan' | 'suv' | 'truck', number> = {
        sedan: 1.5,
        suv: 2.0,
        truck: 2.5,
    };

    const calculateEstimatedPrice = () => {
        if (pickupLocation && dropoffLocation && carType) {
            const distance = haversineDistance(
                pickupLocation.lat,
                pickupLocation.lng,
                dropoffLocation.lat,
                dropoffLocation.lng
            );
            const pricePerKm = pricingModel[carType];
            const price = pricePerKm * distance; // Total price based on distance and car type
            setEstimatedPrice(Number(price.toFixed(2)));
        } else {
            setEstimatedPrice(null);
        }
    };

    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const fetchSuggestions = async (query: string): Promise<Suggestion[]> => {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data: Suggestion[] = await response.json();
        return data.slice(0, 5);
    };

    const handlePickupAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPickupAddress(value);

        if (pickupTimeoutRef.current) {
            clearTimeout(pickupTimeoutRef.current);
        }

        pickupTimeoutRef.current = setTimeout(async () => {
            if (value.length > 2) {
                const suggestions = await fetchSuggestions(value);
                setPickupSuggestions(suggestions);
            } else {
                setPickupSuggestions([]);
            }
        }, 300);
    };

    const handleDropoffAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDropoffAddress(value);

        if (dropoffTimeoutRef.current) {
            clearTimeout(dropoffTimeoutRef.current);
        }

        dropoffTimeoutRef.current = setTimeout(async () => {
            if (value.length > 2) {
                const suggestions = await fetchSuggestions(value);
                setDropoffSuggestions(suggestions);
            } else {
                setDropoffSuggestions([]);
            }
        }, 300);
    };

    const handleSuggestionSelect = (suggestion: Suggestion, type: 'pickup' | 'dropoff') => {
        if (type === 'pickup') {
            setPickupAddress(suggestion.display_name);
            setPickupLocation({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
            setPickupSuggestions([]);
        } else {
            setDropoffAddress(suggestion.display_name);
            setDropoffLocation({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
            setDropoffSuggestions([]);
        }
    };

    const handleAddressSubmit = () => {
        calculateEstimatedPrice();
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <div className="text-lg font-bold">User Dashboard</div>
                <div className="flex space-x-4">
                    <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-500">Logout</button>
                </div>
            </header>

            <div className="flex-grow p-6">
                <h2 className="text-2xl font-semibold mb-4">Book a Ride</h2>

                <div className="bg-white p-4 rounded shadow">
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold" htmlFor="carType">Car Type:</label>
                        <select
                            id="carType"
                            value={carType || ''}
                            onChange={(e) => setCarType(e.target.value as 'sedan' | 'suv' | 'truck')}
                            className="border rounded p-2 w-full"
                        >
                            <option value="" disabled>Select a car type</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="truck">Truck</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-semibold" htmlFor="pickup">Pickup Address:</label>
                        <input
                            type="text"
                            id="pickup"
                            value={pickupAddress}
                            onChange={handlePickupAddressChange}
                            className="border rounded p-2 w-full"
                            placeholder="Enter pickup address"
                        />
                        {pickupSuggestions.length > 0 && (
                            <ul className="border border-gray-300 rounded mt-1">
                                {pickupSuggestions.map((suggestion) => (
                                    <li
                                        key={suggestion.place_id}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => handleSuggestionSelect(suggestion, 'pickup')}
                                    >
                                        {suggestion.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-semibold" htmlFor="dropoff">Dropoff Address:</label>
                        <input
                            type="text"
                            id="dropoff"
                            value={dropoffAddress}
                            onChange={handleDropoffAddressChange}
                            className="border rounded p-2 w-full"
                            placeholder="Enter dropoff address"
                        />
                        {dropoffSuggestions.length > 0 && (
                            <ul className="border border-gray-300 rounded mt-1">
                                {dropoffSuggestions.map((suggestion) => (
                                    <li
                                        key={suggestion.place_id}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => handleSuggestionSelect(suggestion, 'dropoff')}
                                    >
                                        {suggestion.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button
                        onClick={handleAddressSubmit}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                    >
                        Calculate Price
                    </button>

                    {estimatedPrice !== null && (
                        <div className="mt-4">
                            <h3 className="font-semibold">Estimated Price: ${estimatedPrice}</h3>
                        </div>
                    )}

                    <button
                        onClick={handleBooking}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 mt-4"
                    >
                        Book Now
                    </button>
                </div>
            </div>

            <MapContainer center={userLocation || [51.505, -0.09]} zoom={13} className="h-96">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {pickupLocation && <Marker position={pickupLocation} />}
                {dropoffLocation && <Marker position={dropoffLocation} />}
                <RoutingMachine pickup={pickupLocation || [0, 0]} dropoff={dropoffLocation || [0, 0]} />
            </MapContainer>
        </div>
    );
};

export default User;
