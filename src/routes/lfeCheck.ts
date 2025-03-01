import { Request, Response } from "express";
export const lifeCheck = async (req: Request, res: Response) => {
    res.send("HCDT API WORKING");
};