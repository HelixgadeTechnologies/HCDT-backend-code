import { Request, Response } from "express";
import { loginUser, registerUser } from "../service/authService"
export const register = async (req: Request, res: Response) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const token = await loginUser(req.body);
        res.status(200).json({ message: "Login successful", token });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const test = async (req: Request, res: Response) => {
    res.send("Working");
};