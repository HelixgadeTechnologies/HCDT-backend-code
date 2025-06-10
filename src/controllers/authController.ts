import { Request, Response } from "express";
import { loginUser, registerUser, registerAdmin, registerNuprc, registerDRA, registerSettlor, removeUser, getAllAdmin, getAllNUPRC, getAllDRA, getAllSettlor, removeSettlor, getUserById, getAllRole, changePassword, updateProfilePicture, getSettlor, deleteCloudFile, updateLoginUser } from "../service/authService"
import { errorResponse, notFoundResponse, successResponse } from "../utils/responseHandler";
import { Prisma, PrismaClient, Settlor, User } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { bufferToHex } from "../utils/hexBufaBufaHex";
import { uploadFile } from "../utils/upload";

export const register = async (req: Request, res: Response) => {
    try {

        const user = await registerUser(req.body);
        res.status(201).json(successResponse("User registered successfully", user));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }

};
export const getUser = async (req: Request, res: Response) => {
    try {

        const { userId } = req.params;
        if (!userId) {
            res.status(400).json(notFoundResponse("User ID is required", userId));
        }

        const user = await getUserById(userId);

        if (user.length == 0) {
            res.status(400).json(notFoundResponse("User not found", {}));
        }

        res.status(201).json(successResponse("User registered successfully", user[0]));
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

        const userRes = await getUserById(req.body.userId);
        if (userRes.length == 0) {
            res.status(400).json(notFoundResponse("User not found", {}));
        }

        const user = await removeUser(req.body.userId);
        res.status(201).json(successResponse("User removed successfully", user));
    } catch (error: any) {
        console.log(error, "errorr")
        res.status(500).json(errorResponse("Internal server error", error));
    }

};

export const addAdmin = async (req: Request, res: Response) => {
    try {
        // Ensure req.user exists (set in auth middleware)
        if (!req.user || req.user.role !== "SUPER ADMIN") {
            res.status(403).json(errorResponse("Access denied. Only SUPER_ADMIN can add admins.", ""));
        }

        const admin = await registerAdmin(req.body.data, req.body.isCreate);
        res.status(201).json(successResponse(`Admin ${req.body.isCreate ? "created" : "updated"} successfully`, admin));
    } catch (error: any) {
        res.status(400).json(errorResponse("Internal server error", error));
    }
};

export const updateLogInUser = async (req: Request, res: Response) => {
    try {
        const admin = await updateLoginUser(req.body);
        res.status(201).json(successResponse(`Update successfully`, admin));
    } catch (error: any) {
        res.status(400).json(errorResponse("Internal server error", error));
    }
};
export const getRoles = async (req: Request, res: Response) => {
    try {
        const roles = await getAllRole();
        res.status(201).json(successResponse("Roles", roles));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
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
        res.status(201).json(successResponse(`NUPRC successfully ${req.body.isCreate ? "created" : "updated"}`, NUPRC));
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
        res.status(201).json(successResponse(`DRA successfully ${req.body.isCreate ? "created" : "updated"}`, DRA));
    } catch (error: any) {
        console.log(error, "error")
        // Check if the error is a Prisma error and handle it accordingly
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
        res.status(201).json(successResponse(`Settlor successfully ${req.body.isCreate ? "created" : "updated"}`, settlor));
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
        const { settlorId } = req.body;

        // Check if settlorId is missing, null, undefined, or an empty string
        if (!settlorId || settlorId.trim() === "") {
            res.status(400).json(errorResponse("Settlor ID is required for deleting a settlor."));
        }

        const data = await getSettlor(req.body.settlorId);

        if (data == null) {
            res.status(404).json(notFoundResponse("Invalid settlor Id.", null));
        }

        const settlor = await removeSettlor(req.body.settlorId);

        res.status(201).json(successResponse("Settlor successfully removed", settlor));

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

export const changeUserPassword = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId; // Assuming user ID is available from auth middleware
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!userId) {
            res.status(401).json(errorResponse("Unauthorized: User not authenticated."));
        }

        if (!oldPassword || !newPassword || !confirmPassword) {
            res.status(400).json(errorResponse("All fields are required."));
        }

        const result = await changePassword(userId, oldPassword, newPassword, confirmPassword);
        res.status(200).json(successResponse(result.message));
    } catch (error: any) {
        res.status(400).json(errorResponse(error.message));
    }
};

export const updateUserProfilePicture = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId; // Assuming user ID is available from authentication middleware
        const { base64String, mimeType } = req.body;

        if (!userId) {
            res.status(401).json(errorResponse("Unauthorized: User not authenticated."));
        }

        if (!base64String || !mimeType) {
            res.status(400).json(errorResponse("Both base64String and mimeType are required."));
        }

        const result = await updateProfilePicture(userId, base64String, mimeType);
        res.status(200).json(successResponse(result.message, result.data));
    } catch (error: any) {
        res.status(400).json(errorResponse(error.message));
    }
};

export const upload = async (req: Request, res: Response) => {
    try {
        const { base64String, mimeType } = req.body;

        if (!base64String || !mimeType) {
            res.status(400).json(errorResponse("Both base64String and mimeType are required."));
        }
        let uploadUrl = await uploadFile(base64String, mimeType)

        res.status(200).json(successResponse("uploadUrl", uploadUrl));
    } catch (error: any) {
        res.status(400).json(errorResponse(error.message));
    }
};
export const destroyCloudFile = async (req: Request, res: Response) => {
    try {
        const { url } = req.body;

        if (!url) {
            res.status(400).json(errorResponse("File url required."));
        }
        // Assuming the URL is the public ID of the file in Cloudinary
        await deleteCloudFile(url);
        // If the deletion is successful, return a success response

        res.status(200).json(successResponse("destroyed",null));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};
export const test = async (req: Request, res: Response) => {
    res.send("HCDT API WORKING");
};