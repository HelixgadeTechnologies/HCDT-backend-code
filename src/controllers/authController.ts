import { Request, Response } from "express";
import { loginUser, registerUser, registerAdmin, registerNuprc, registerDRA, registerSettlor } from "../service/authService"
import { errorResponse, successResponse } from "../utils/responseHandler";
export const register = async (req: Request, res: Response) => {
    try {

        const user = await registerUser(req.body);
        res.status(201).json(successResponse("User registered successfully", user));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }

};
export const addAdmin = async (req: Request, res: Response) => {
    try {
        const admin = await registerAdmin(req.body, req.body.isCreate);
        res.status(201).json(successResponse("Admin registered successfully", admin));
    } catch (error: any) {
        res.status(400).json(errorResponse("Internal server error", error));
    }
};
export const addNuprc = async (req: Request, res: Response) => {
    try {
        const NUPRC = await registerNuprc(req.body, req.body.isCreate);
        res.status(201).json(successResponse("NUPRC registered successfully", NUPRC));
    } catch (error: any) {
        res.status(400).json(errorResponse("Internal server error", error));
    }
};
export const addDRA = async (req: Request, res: Response) => {
    try {
        const DRA = await registerDRA(req.body, req.body.isCreate);
        res.status(201).json(successResponse("DRA registered successfully", DRA));
    } catch (error: any) {
        res.status(400).json(errorResponse("Internal server error", error));
    }
};
export const addSettlor = async (req: Request, res: Response) => {
    try {
        const settlor = await registerSettlor(req.body, req.body.isCreate);
        res.status(201).json(successResponse("Settlor registered successfully", settlor));
    } catch (error: any) {
        res.status(400).json(errorResponse("Internal server error", error));
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const token = await loginUser(req.body);
        res.status(200).json(successResponse("Login successfully", token));
    } catch (error: any) {
        res.status(400).json(errorResponse("Internal server error", error));
    }
};

export const test = async (req: Request, res: Response) => {
    res.send("HCDT API WORKING");
};