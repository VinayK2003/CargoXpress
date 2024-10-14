import React from 'react';
import Link from 'next/link';

const Driver = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header Navigation Bar */}
            <header className="bg-green-600 text-white p-4 flex justify-between items-center">
                <div className="text-lg font-bold">Logistics App</div>
                <div className="flex space-x-4">
                    <Link href="/home" className="hover:underline">Home</Link>
                    <Link href="/profile" className="hover:underline">Profile</Link>
                    <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-500">Logout</button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-grow p-6 space-x-4">
                {/* Left Column (Available Bookings) */}
                <div className="w-2/3 bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Available Bookings</h2>
                    <div className="border-b mb-4 pb-2">
                        <p className="font-semibold">Booking ID: #12345</p>
                        <p>Pickup: Location A</p>
                        <p>Drop-off: Location B</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Accept</button>
                        <button className="bg-red-600 text-white px-4 py-2 rounded mt-2 ml-2">Reject</button>
                    </div>
                    <div className="border-b mb-4 pb-2">
                        <p className="font-semibold">Booking ID: #67890</p>
                        <p>Pickup: Location C</p>
                        <p>Drop-off: Location D</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Accept</button>
                        <button className="bg-red-600 text-white px-4 py-2 rounded mt-2 ml-2">Reject</button>
                    </div>
                </div>

                {/* Right Column (Current Job Status) */}
                <div className="w-1/3 bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Current Job Status</h2>
                    <div className="border-b mb-4 pb-2">
                        <p className="font-semibold">Current Job ID: #54321</p>
                        <p>Status: En Route to Pickup</p>
                        <button className="bg-green-600 text-white px-4 py-2 rounded mt-2">Update Status</button>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Job Updates</h3>
                    <div className="border-b mb-4 pb-2">
                        <p>Status Update: Arrived at Pickup Location</p>
                    </div>
                    <div className="border-b mb-4 pb-2">
                        <p>Status Update: Goods Collected</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center p-4">
                <p>Help & Support | Privacy Policy | Terms of Service</p>
            </footer>
        </div>
    );
};

export default Driver;
