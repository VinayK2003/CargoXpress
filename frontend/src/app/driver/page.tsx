"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Booking {
    bookingId: string;
    pickupAddress: string;
    dropoffAddress: string;
    carType: string;
    estimatedPrice: number;
    status: string;
}

const Driver: React.FC = () => {
    const [availableBookings, setAvailableBookings] = useState<Booking[]>([]);
    const [currentJob, setCurrentJob] = useState<Booking | null>(null);

    useEffect(() => {
        // In a real application, you would fetch this data from your server
        // For now, we'll simulate this by reading from localStorage
        const fetchBookings = () => {
            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            setAvailableBookings(bookings.filter((booking: Booking) => booking.status === 'pending'));
        };

        fetchBookings();
        // Set up an interval to periodically check for new bookings
        const interval = setInterval(fetchBookings, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleAccept = (booking: Booking) => {
        // Update the booking status
        const updatedBookings = availableBookings.filter(b => b.bookingId !== booking.bookingId);
        setAvailableBookings(updatedBookings);
        setCurrentJob({ ...booking, status: 'accepted' });

        // Update in localStorage
        const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const updatedAllBookings = allBookings.map((b: Booking) => 
            b.bookingId === booking.bookingId ? { ...b, status: 'accepted' } : b
        );
        localStorage.setItem('bookings', JSON.stringify(updatedAllBookings));
    };

    const handleReject = (booking: Booking) => {
        // Remove the booking from available bookings
        const updatedBookings = availableBookings.filter(b => b.bookingId !== booking.bookingId);
        setAvailableBookings(updatedBookings);

        // Update in localStorage
        const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const updatedAllBookings = allBookings.filter((b: Booking) => b.bookingId !== booking.bookingId);
        localStorage.setItem('bookings', JSON.stringify(updatedAllBookings));
    };

    const handleUpdateStatus = () => {
        if (currentJob) {
            const newStatus = prompt("Enter new status:", currentJob.status);
            if (newStatus) {
                setCurrentJob({ ...currentJob, status: newStatus });
                // Update in localStorage
                const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                const updatedAllBookings = allBookings.map((b: Booking) => 
                    b.bookingId === currentJob.bookingId ? { ...b, status: newStatus } : b
                );
                localStorage.setItem('bookings', JSON.stringify(updatedAllBookings));
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-green-600 text-white p-4 flex justify-between items-center">
                <div className="text-lg font-bold">Logistics App</div>
                <div className="flex space-x-4">
                    <Link href="/home" className="hover:underline">Home</Link>
                    <Link href="/profile" className="hover:underline">Profile</Link>
                    <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-500">Logout</button>
                </div>
            </header>

            <div className="flex flex-grow p-6 space-x-4">
                <div className="w-2/3 bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Available Bookings</h2>
                    {availableBookings.map((booking) => (
                        <div key={booking.bookingId} className="border-b mb-4 pb-2">
                            <p className="font-semibold">Booking ID: #{booking.bookingId}</p>
                            <p>Pickup: {booking.pickupAddress}</p>
                            <p>Drop-off: {booking.dropoffAddress}</p>
                            <p>Car Type: {booking.carType}</p>
                            <p>Estimated Price: ${booking.estimatedPrice}</p>
                            <button 
                                className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
                                onClick={() => handleAccept(booking)}
                            >
                                Accept
                            </button>
                            <button 
                                className="bg-red-600 text-white px-4 py-2 rounded mt-2 ml-2"
                                onClick={() => handleReject(booking)}
                            >
                                Reject
                            </button>
                        </div>
                    ))}
                </div>

                <div className="w-1/3 bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Current Job Status</h2>
                    {currentJob ? (
                        <div className="border-b mb-4 pb-2">
                            <p className="font-semibold">Current Job ID: #{currentJob.bookingId}</p>
                            <p>Status: {currentJob.status}</p>
                            <p>Pickup: {currentJob.pickupAddress}</p>
                            <p>Drop-off: {currentJob.dropoffAddress}</p>
                            <button 
                                className="bg-green-600 text-white px-4 py-2 rounded mt-2"
                                onClick={handleUpdateStatus}
                            >
                                Update Status
                            </button>
                        </div>
                    ) : (
                        <p>No current job</p>
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