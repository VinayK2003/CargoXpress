"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import DriverMap from '../components/DriverMap/DriverMap';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Booking {
    id: number;
    pickupAddress: string;
    dropoffAddress: string;
    carType: string;
    estimatedPrice: number;
    status: string;
    pickupLocation: { lat: number; lng: number };
    dropoffLocation: { lat: number; lng: number };
}

const Driver: React.FC = () => {
    const [availableBookings, setAvailableBookings] = useState<Booking[]>([]);
    const [driverLocation, setDriverLocation] = useState({ lat: 0, lng: 0 });
    const [currentJob, setCurrentJob] = useState<Booking | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/bookings');
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                const bookings = await response.json();
                setAvailableBookings(bookings.filter((booking: Booking) => booking.status === 'pending'));
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        const updateDriverLocation = () => {
            navigator.geolocation.getCurrentPosition((position) => {
                setDriverLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        };
        fetchBookings();
        updateDriverLocation();
        const locationInterval = setInterval(updateDriverLocation, 5000);

        const bookingInterval = setInterval(fetchBookings, 5000);

        return () => {
            clearInterval(locationInterval);
            clearInterval(bookingInterval);
        }
    }, []);

    const handleAccept = (booking: Booking) => {
        const updatedBookings = availableBookings.filter(b => b.id !== booking.id);
        setAvailableBookings(updatedBookings);
        setCurrentJob({ ...booking, status: 'accepted' });

        const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const updatedAllBookings = allBookings.map((b: Booking) => 
            b.id === booking.id ? { ...b, status: 'accepted' } : b
        );
        localStorage.setItem('bookings', JSON.stringify(updatedAllBookings));
    };

    const handleReject = async (booking: Booking) => {
        try {
            const id = booking.id;
            await axios.delete('http://localhost:5000/api/bookings', { data: { id } });
      
            const updatedBookings = availableBookings.filter(b => b.id !== id);
            setAvailableBookings(updatedBookings);
        } catch (error) {
            console.error("Error rejecting booking:", error);
        }
    };

    const handleLogout = () => {
        window.location.href = '/login'; 
    };

    const handleUpdateStatus = async (newStatus: string, booking: Booking) => {
        try {
            await axios.put(`http://localhost:5000/api/bookings`, { id: booking.id, status: newStatus });
            setCurrentJob((prev) => (prev ? { ...prev, status: newStatus } : null));
        } catch (error) {
            console.error("Error updating booking status:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-green-600 text-white p-4 flex justify-between items-center">
                <div className="text-lg font-bold">Logistics App</div>
                <div className="flex space-x-4">
                    <Link href="/home" className="hover:underline">Home</Link>
                    <Link href="/profile" className="hover:underline">Profile</Link>
                    <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-500" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <div className="flex flex-grow p-6 space-x-4">
                <div className="w-2/3 bg-white p-4 rounded shadow">
                    {currentJob ? (
                        <DriverMap 
                            pickup={currentJob.pickupLocation}
                            dropoff={currentJob.dropoffLocation}
                            driverLocation={driverLocation}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            No active job. Accept a booking to see the map.
                        </div>
                    )}
                </div>
                
                <div className="w-1/3 bg-white p-4 rounded shadow overflow-y-auto" style={{maxHeight: 'calc(100vh - 200px)'}}>
                    {currentJob ? (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Current Job</h2>
                            <div className="mb-4">
                                <p className="font-semibold">Job ID: #{currentJob.id}</p>
                                <p>Pickup: {currentJob.pickupAddress}</p>
                                <p>Drop-off: {currentJob.dropoffAddress}</p>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="mt-2 flex flex-row items-center gap-2 justify-center bg-white text-gray-900 py-1 px-3 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors">
                                        {currentJob.status.replace(/_/g, ' ')}
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="bottom" align="start">
                                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {['pending', 'en_route_to_pickup', 'goods_collected', 'en_route_to_dropoff', 'delivered', 'canceled'].map((status) => (
                                            <DropdownMenuItem key={status} onClick={() => handleUpdateStatus(status, currentJob)}>
                                                {status.replace(/_/g, ' ')}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Available Bookings</h2>
                            {availableBookings.map((booking) => (
                                <div key={booking.id} className="border-b mb-4 pb-2">
                                    <p className="font-semibold">Booking ID: #{booking.id}</p>
                                    <p>Pickup: {booking.pickupAddress}</p>
                                    <p>Drop-off: {booking.dropoffAddress}</p>
                                    <p>Car Type: {booking.carType}</p>
                                    <p>Estimated Price: ${booking.estimatedPrice}</p>
                                    <div className="flex mt-2">
                                        <button 
                                            className="bg-blue-600 text-white px-3 py-1 rounded mr-2 text-sm"
                                            onClick={() => handleAccept(booking)}
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                            onClick={() => handleReject(booking)}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <footer className="bg-gray-800 text-white text-center p-4">
                <p>Help & Support | Privacy Policy | Terms of Service</p>
            </footer>
        </div>
    );
};
export default Driver;