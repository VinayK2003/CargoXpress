'use client';

import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center text-white mb-10">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to CargoXpress</h1>
        <p className="text-lg font-medium">
          The most reliable platform to move your goods, anytime, anywhere.
        </p>
      </div>

      <div className="flex space-x-6">
        {/* Login Button */}
        <Link href="/login" className="px-6 py-3 text-lg font-semibold bg-white text-indigo-600 rounded-md shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
          Login
        </Link>

        {/* Signup Button */}
        <Link href="/signup" className="px-6 py-3 text-lg font-semibold bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out">
          Signup
        </Link>
      </div>

      {/* Image for cool effect */}
      <div className="mt-16 relative overflow-hidden w-full h-32"> {/* Added fixed height */}
        {/* Vehicle animation */}
        <div className="vehicle-container">
          <img
            src="/icons/images.jpeg"  // Replace with your JPEG file path
            alt="Logistics"
            className="vehicle-animation"
          />
        </div>
      </div>

      <style jsx>{`
        .vehicle-container {
          position: absolute;
          animation: moveVehicle 5s linear infinite;
          left: -200px; 
        }

        @keyframes moveVehicle {
          0% {
            left: -200px;
          }
          100% {
            left: calc(100vw + 200px); 
          }
        }

        .vehicle-animation {
          width: 200px; 
          height: auto; 
        }
      `}</style>
    </div>
  );
}
