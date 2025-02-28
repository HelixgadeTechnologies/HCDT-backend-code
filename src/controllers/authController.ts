import { Request, Response } from "express";
import { loginUser, registerUser, registerAdmin, registerNuprc, registerDRA, registerSettlor, removeUser, getAllAdmin, getAllNUPRC, getAllDRA, getAllSettlor, removeSettlor } from "../service/authService"
import { errorResponse, notFoundResponse, successResponse } from "../utils/responseHandler";
import { Prisma, PrismaClient, Settlor, User } from "@prisma/client";
export const register = async (req: Request, res: Response) => {
    try {

        const user = await registerUser(req.body);
        res.status(201).json(successResponse("User registered successfully", user));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }

};
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json(notFoundResponse("User ID is required", userId));
        }
        const user = await removeUser(req.body);
        res.status(201).json(successResponse("User removed successfully", user));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }

};

export const addAdmin = async (req: Request, res: Response) => {
    try {
        const admin = await registerAdmin(req.body.data, req.body.isCreate);
        res.status(201).json(successResponse("Admin registered successfully", admin));
    } catch (error: any) {
        res.status(400).json(errorResponse("Internal server error", error));
    }
};
export const listAllAdmin = async (req: Request, res: Response) => {
    try {
        const admin = await getAllAdmin();
        res.status(201).json(successResponse("Admin", admin));
    } catch (error: any) {
        res.status(400).json(errorResponse("Internal server error", error));
    }
};


export const addNuprc = async (req: Request, res: Response) => {
    try {
        const NUPRC = await registerNuprc(req.body.data, req.body.isCreate);
        res.status(201).json(successResponse("NUPRC registered successfully", NUPRC));
    } catch (error: any) {
        res.status(400).json(errorResponse("Internal server error", error));
    }
};

export const listAllNUPRC = async (req: Request, res: Response) => {
    try {
        const nuprc = await getAllNUPRC();
        res.status(201).json(successResponse("NUPRC-ADR", nuprc));
    } catch (error: any) {
        res.status(400).json(errorResponse("Internal server error", error));
    }
};
export const addDRA = async (req: Request, res: Response) => {
    try {
        const DRA = await registerDRA(req.body.data, req.body.isCreate);
        res.status(201).json(successResponse("DRA registered successfully", DRA));
    } catch (error: any) {
        res.status(400).json(errorResponse("Internal server error", error));
    }
};

export const listAllDRA = async (req: Request, res: Response) => {
    try {
        const dra = await getAllDRA();
        res.status(201).json(successResponse("DRA", dra));
    } catch (error: any) {
        res.status(400).json(errorResponse("Internal server error", error));
    }
};
export const addSettlor = async (req: Request, res: Response) => {
    try {
        const settlor = await registerSettlor(req.body.data, req.body.isCreate);
        res.status(201).json(successResponse("Settlor registered successfully", settlor));
    } catch (error: any) {
        res.status(400).json(errorResponse("Internal server error", error));
    }
};

export const listAllSettlor = async (req: Request, res: Response) => {
    try {
        const settlor = await getAllSettlor();
        res.status(201).json(successResponse("SETTLOR", settlor));
    } catch (error: any) {
        res.status(400).json(errorResponse("Internal server error", error));
    }
};
export const deleteSettlor = async (req: Request, res: Response) => {
    try {
        const settlor = await removeSettlor(req.body);
        res.status(201).json(successResponse("SETTLOR", settlor));
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