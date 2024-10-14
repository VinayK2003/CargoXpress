import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt";
import User from "../models/user"
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

    return res.status(201).json({ message: "User created successfully!" });
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
    return res.status(200).json({ message: "User logged in successfully", token });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
};