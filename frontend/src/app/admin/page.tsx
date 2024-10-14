import React from 'react';
import Link from 'next/link';

const Admin = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header Navigation Bar */}
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <div className="text-lg font-bold">Logistics Admin Panel</div>
                <div className="flex space-x-4">
                    <Link href="/home" className="hover:underline">Home</Link>
                    <Link href="/profile" className="hover:underline">Profile</Link>
                    <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-500">Logout</button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-grow p-6 space-x-4">
                {/* Left Column (Fleet Management) */}
                <div className="w-2/3 bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Fleet Management</h2>
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="border-b p-2">Vehicle ID</th>
                                <th className="border-b p-2">Type</th>
                                <th className="border-b p-2">Status</th>
                                <th className="border-b p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border-b p-2">V001</td>
                                <td className="border-b p-2">Truck</td>
                                <td className="border-b p-2">Available</td>
                                <td className="border-b p-2">
                                    <button className="bg-red-600 text-white px-2 py-1 rounded">Remove</button>
                                </td>
                            </tr>
                            <tr>
                                <td className="border-b p-2">V002</td>
                                <td className="border-b p-2">Van</td>
                                <td className="border-b p-2">In Use</td>
                                <td className="border-b p-2">
                                    <button className="bg-red-600 text-white px-2 py-1 rounded">Remove</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Right Column (Analytics Overview) */}
                <div className="w-1/3 bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
                    <div className="mb-4">
                        <p className="font-semibold">Total Trips Completed: 1,200</p>
                        <p className="font-semibold">Average Trip Time: 30 mins</p>
                        <p className="font-semibold">Active Drivers: 500</p>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
                    <div className="border-b mb-4 pb-2">
                        <p>Driver ID: D001 - Trip ID: T12345 - Status: Completed</p>
                    </div>
                    <div className="border-b mb-4 pb-2">
                        <p>Driver ID: D002 - Trip ID: T67890 - Status: In Progress</p>
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

export default Admin;
