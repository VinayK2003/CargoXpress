import { Request, Response } from 'express';

export const signup = async (req: Request, res: Response) => {
  res.status(201).json({ message: 'User registered successfully' });
};

export const login = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'User logged in successfully' });
};
