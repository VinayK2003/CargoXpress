"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import io from 'socket.io-client';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Driver {
    driverId: number;
    carType: string;
    earned: number;
    completedTrips: number;
    distanceTravelled: number;
    avgTripTime: number;
    status: string[];
}

const Admin: React.FC = () => {
    const [driverStats, setDriverStats] = useState<Driver[]>([]);
    const [loadingDrivers, setLoadingDrivers] = useState<boolean>(true);

    useEffect(() => {
        const fetchDriverStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/vehicles');
                setDriverStats(response.data);
            } catch (error) {
                console.error('Error fetching driver stats:', error);
            } finally {
                setLoadingDrivers(false);
            }
        };
        fetchDriverStats();
    }, []);

    const getTotalEarnings = () => driverStats.reduce((sum, driver) => sum + driver.earned, 0);
    const getTotalTrips = () => driverStats.reduce((sum, driver) => sum + driver.completedTrips, 0);
    const getAverageDistance = () => {
        const totalDistance = driverStats.reduce((sum, driver) => sum + driver.distanceTravelled, 0);
        return driverStats.length ? totalDistance / driverStats.length : 0;
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="bg-green-600 text-white p-4 flex justify-between items-center">
                <div className="text-2xl font-bold">Admin Dashboard</div>
                <div className="flex space-x-4">
                    <Link href="/home" className="hover:underline">Home</Link>
                    <Link href="/admin" className="hover:underline">Admin</Link>
                    <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition-colors" onClick={() => window.location.href = '/login'}>
                        Logout
                    </button>
                </div>
            </header>

            <div className="flex-grow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Total Earnings</h2>
                        <p className="text-2xl font-bold">${getTotalEarnings().toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Total Trips</h2>
                        <p className="text-2xl font-bold">{getTotalTrips()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Avg Distance per Driver</h2>
                        <p className="text-2xl font-bold">{getAverageDistance().toFixed(2)} km</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Driver Performance</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={driverStats}>
                            <XAxis dataKey="driverId" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="completedTrips" fill="#8884d8" name="Completed Trips" />
                            <Bar yAxisId="right" dataKey="earned" fill="#82ca9d" name="Earnings ($)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Fleet Management</h2>
                    {loadingDrivers ? (
                        <p>Loading driver stats...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-300">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="border border-gray-300 p-2">Driver ID</th>
                                        <th className="border border-gray-300 p-2">Car Type</th>
                                        <th className="border border-gray-300 p-2">Earnings</th>
                                        <th className="border border-gray-300 p-2">Completed Trips</th>
                                        <th className="border border-gray-300 p-2">Distance Travelled</th>
                                        <th className="border border-gray-300 p-2">Avg Trip Time</th>
                                        <th className="border border-gray-300 p-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {driverStats.map(driver => (
                                        <tr key={driver.driverId} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 p-2">{driver.driverId}</td>
                                            <td className="border border-gray-300 p-2">{driver.carType}</td>
                                            <td className="border border-gray-300 p-2">${driver.earned.toFixed(2)}</td>
                                            <td className="border border-gray-300 p-2">{driver.completedTrips}</td>
                                            <td className="border border-gray-300 p-2">{driver.distanceTravelled.toFixed(2)} km</td>
                                            <td className="border border-gray-300 p-2">{driver.avgTripTime.toFixed(2)} min</td>
                                            <td className="border border-gray-300 p-2">{driver.status.join(', ')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <footer className="bg-gray-800 text-white text-center p-4">
                <p>© 2024 Your Company | Help & Support | Privacy Policy | Terms of Service</p>
            </footer>
        </div>
    );
};

export default Admin;