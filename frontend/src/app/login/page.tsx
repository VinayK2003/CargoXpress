"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [role, setRole] = useState<"user" | "driver">("user");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null); 
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value as "user" | "driver");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isClient) return;
    var adminpath="";
        if(username=="admin" && password=="admin"){
            adminpath="/admin";
        }
        
        router.push(adminpath); 

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include' 
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        const userId = data.userId;
        localStorage.setItem("token", data.token); 
        const roleRedirectPath = role === "driver" ?`/driver/${userId}` : `/user/${userId}`;
        router.push(roleRedirectPath); 
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Login failed"); 
      }
    } catch (error) {
      console.error("Error during login", error);
      setError("An unexpected error occurred. Please try again."); 
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <span className="mr-4">Role:</span>
            <label className="mr-4">
              <input
                type="radio"
                value="user"
                checked={role === "user"}
                onChange={handleRoleChange}
                className="mr-1"
              />
              User
            </label>
            <label>
              <input
                type="radio"
                value="driver"
                checked={role === "driver"}
                onChange={handleRoleChange}
                className="mr-1"
              />
              Driver
            </label>
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
          <p className="mt-4 text-center text-sm">
            New User?{" "}
            <a href="/signup" className="text-indigo-600 hover:text-indigo-500">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
