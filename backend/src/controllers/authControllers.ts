import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt";
import {PrismaClient} from "@prisma/client"

const prisma=new PrismaClient();


export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password, email, phoneNo, name, role, carType } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        phoneNo,
        name,
        role,
        carType: role === "driver" ? carType : undefined,
      },
    });

    return res.status(201).json({ message: "User created successfully!" ,userId:newUser.id});
  } catch (error) {
    return res.status(500).json({ message: "Error signing up", error });
  }

};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } }); 
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    
    const token = jwt.sign({ id: user.id }, JWT_SECRET as string, { expiresIn: "1h" });
    console.log("JWT_SECRET:", token);

    // Return the token in the response
    return res.status(200).json({ message: "User logged in successfully", token,userId:user.id });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
};

export const handleBooking = async (req: Request, res: Response) => {
  try {
    if (req.method === 'POST') {
      // Create a new booking
      const { pickupLocation, dropoffLocation, pickupAddress, dropoffAddress, carType, estimatedPrice } = req.body;

      const newBooking = await prisma.booking.create({
        data: {
          pickupLocation,
          dropoffLocation,
          pickupAddress,
          dropoffAddress,
          carType,
          estimatedPrice,
          status: 'pending',
        },
      });

      return res.status(201).json(newBooking);
    } else if (req.method === 'GET') {
      // Fetch pending bookings
      const pendingBookings = await prisma.booking.findMany({
        where: {
          status: 'pending',
        },
      });

      return res.status(200).json(pendingBookings);
    } else if (req.method === 'DELETE') {
      // Delete a booking
      const { id } = req.body; // Assuming you send the booking ID in the request body

      const deletedBooking = await prisma.booking.delete({
        where: {
          id: id, // Use the correct identifier
        },
      });

      return res.status(204).json({ message: "Booking deleted successfully" });
    }
    else if (req.method === 'PUT') {
      const { id, status } = req.body; // Assuming you send the booking ID and new status in the request body

      const updatedBooking = await prisma.booking.update({
        where: {
          id: id, 
        },
        data: {
          status, 
        },
      });

      return res.status(200).json(updatedBooking); // Return the updated booking
    } else {
      return res.status(405).json({ message: "Method not allowed" }); // Method not allowed
    }
  } catch (error) {
    console.error("Error handling booking:", error);
    return res.status(500).json({ message: "Error handling booking", error });
  }
};
export const driverperformance = async (req: Request, res: Response) => {
  try {
    if (req.method === 'PUT') {
      const { id, distance, earned, rating, noOfTrips, avgTripTime } = req.body;
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedDriver = await prisma.user.update({
        where: {
          id: id,
          role: "driver"
        },
        data: {
          distanceTravelled: Math.floor(user.distanceTravelled + distance), // Use correct field
          earned: Math.floor(user.earned + earned), // Use correct field
          completedTrips: noOfTrips+1, // Update the completedTrips count
          avgTripTime: Math.floor(avgTripTime), // Use correct field
        },
      });

      return res.status(200).json({
        message: 'Driver data updated successfully',
        driver: updatedDriver,
      });
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error updating driver performance:", error);
    return res.status(500).json({ message: "Error updating driver performance", error });
  }
};
export const manageVehicles = async (req: Request, res: Response) => {
    try {
        const drivers = await prisma.user.findMany({
            where: {
                role: 'driver', 
            },
            select: {
                id: true,
                carType: true,
                earned: true,
                completedTrips: true,
                distanceTravelled: true,
                avgTripTime: true,
            },
        });
        const bookings = await prisma.booking.findMany({
            where: {
                driverId: {
                    in: drivers.map(driver => driver.id)
                },
            },
            select: {
                driverId: true,
                status: true,
            },
        });
        const bookingStatusMap = bookings.reduce((acc, booking) => {
            const driverId = booking.driverId;
            if (driverId !== null) {
                if (!acc[driverId]) {
                    acc[driverId] = []; 
                }
                acc[driverId].push(booking.status);
            }
            return acc;
        }, {} as Record<number, string[]>);

        const driverStats = drivers.map(driver => {
            return {
                driverId: driver.id,
                carType: driver.carType,
                earned: driver.earned || 0,
                completedTrips: driver.completedTrips || 0,
                distanceTravelled: driver.distanceTravelled || 0,
                avgTripTime: driver.avgTripTime || 0,
                status: bookingStatusMap[driver.id] || [], 
            };
        });
        console.log("driverStats ",driverStats)
        return res.status(200).json(driverStats);
    } catch (error) {
        console.error('Error managing vehicles:', error);
        return res.status(500).json({ message: 'An error occurred while managing vehicles.' });
    }
};

export const addDriver = async (req: Request, res: Response) => {
  const { userId, id } = req.body;

  try {
      if (!userId || !id) {
          return res.status(400).json({ message: 'userId and id are required.' });
      }
      const updatedBooking = await prisma.booking.update({
          where: {
              id: id,
          },
          data: {
              driverId: userId,
          },
      });
      return res.status(200).json(updatedBooking);
  } catch (error) {
      console.error('Error adding driver:', error);
      return res.status(500).json({ message: 'An error occurred while adding the driver.' });
  }
};