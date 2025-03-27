import { Router } from "express";
import { upload } from "../controllers/authController";

const uploadRoutes: Router = Router();
/**
 * @swagger
 * /api/upload/file-upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Upload] 
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               base64String:
 *                 type: string
 *                 example: "89504e470d0a1a0a0000000d49484452..."
 *                 description: The base64 encoded string of the file.
 *               mimeType:
 *                 type: string
 *                 example: "image/png"
 *                 description: The MIME type of the file.
 *     responses:
 *       '200':
 *         description: Successful upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "uploadUrl"
 *                 data:
 *                   type: string
 *                   description: The URL of the uploaded file.
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Both base64String and mimeType are required."
 *                 error:
 *                   type: string
 *                   description: The error message.
 */
uploadRoutes.post("/file-upload", upload);

export default uploadRoutes