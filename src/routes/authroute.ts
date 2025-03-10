import { Router } from "express";
import { addAdmin, addDRA, addNuprc, addSettlor, changeUserPassword, deleteSettlor, deleteUser, getRoles, getUser, listAllAdmin, listAllDRA, listAllNUPRC, listAllSettlor, login, register, test, updateUserProfilePicture } from "../controllers/authController";

const authRoutes: Router = Router();
/**
 * @swagger
 * /api/auth/signIn:
 *   post:
 *     summary: Sign In a user
 *     tags: [Auth] 
 *     description: Fetches a user from the database for login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: A user record.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User signed in successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "123456"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     token:
 *                       type: string
 *                       example: "jwt-token-string"
 *       400:
 *         description: Bad request (missing parameters)
 *       401:
 *         description: Unauthorized (invalid credentials)
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/signIn", login);

/**
 * @swagger
 * /api/auth/signUp:
 *   post:
 *     summary: SignUp a user
 *     tags: [Auth]
 *     description: Save a user's data to the database during sign-up
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - address
 *               - phoneNumber
 *               - community
 *               - state
 *               - localGovernmentArea
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               address:
 *                 type: string
 *                 example: "location 22 street"
 *               phoneNumber:
 *                 type: string
 *                 example: "09037454733"
 *               community:
 *                 type: string
 *                 example: "Choba"
 *               state:
 *                 type: string
 *                 example: "Rivers"
 *               localGovernmentArea:
 *                 type: string
 *                 example: "Obiaokpo"
 *               password:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: User signed up successfully.
 */
authRoutes.post("/signUp", register);

/**
 * @swagger
 * /api/auth/test:
 *   get:
 *     summary: Entry Point
 *     tags: [Auth]
 *     description: This is just a test route
 *     responses:
 *       200:
 *         description: Settlor.
 */
authRoutes.get("/test", test);

export default authRoutes