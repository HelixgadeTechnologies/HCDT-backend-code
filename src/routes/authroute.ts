import { Router } from "express";
import { addAdmin, addDRA, addNuprc, addSettlor, login, register, test } from "../controllers/authController";

const authRoutes: Router = Router();
/**
 * @swagger
 * /api/auth/signIn:
 *   post:
 *     summary: Sign In a user
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
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: User signed up successfully.
 */
authRoutes.post("/signUp", register);
/**
 * @swagger
 * /api/auth/addAdmin:
 *   post:
 *     summary: Create or Update an Admin
 *     description: Creates a new admin if isCreate is true, otherwise updates an existing admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isCreate
 *               - data
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 example: true
 *               data:
 *                 type: object
 *                 required:
 *                   - email
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     example: "admin@example.com"
 *                   roleId:
 *                     type: string
 *                     example: "uuid-role-id"
 *                   trustId:
 *                     type: string
 *                     example: "uuid-trust-id"
 *                   status:
 *                     type: integer
 *                     example: 0
 *     responses:
 *       200:
 *         description: Successfully created or updated an admin.
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
 *                   example: "Admin created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "123456"
 *                     email:
 *                       type: string
 *                       example: "admin@example.com"
 *       400:
 *         description: Bad request (e.g., email already exists when creating)
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/addAdmin", addAdmin);

/**
 * @swagger
 * /api/auth/addNuprc:
 *   post:
 *     summary: Create or Update NUPRC-ADR
 *     description: Creates a new NUPRC-ADR if isCreate is true, otherwise updates an existing NUPRC-ADR.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isCreate
 *               - data
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 example: true
 *               data:
 *                 type: object
 *                 required:
 *                   - email
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     example: "admin@example.com"
 *                   roleId:
 *                     type: string
 *                     example: "uuid-role-id"
 *                   status:
 *                     type: integer
 *                     example: 0
 *     responses:
 *       200:
 *         description: Successfully created or updated NUPRC-ADR.
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
 *                   example: "NUPRC-ADR created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "123456"
 *                     email:
 *                       type: string
 *                       example: "admin@example.com"
 *       400:
 *         description: Bad request (e.g., email already exists when creating)
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/addNuprc", addNuprc);

/**
 * @swagger
 * /api/auth/addDRA:
 *   post:
 *     summary: Create or Update DRA
 *     description: Creates a new DRA if isCreate is true, otherwise updates an existing DRA.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isCreate
 *               - data
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 example: true
 *               data:
 *                 type: object
 *                 required:
 *                   - email
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     example: "admin@example.com"
 *                   roleId:
 *                     type: string
 *                     example: "uuid-role-id"
 *                   status:
 *                     type: integer
 *                     example: 0
 *     responses:
 *       200:
 *         description: Successfully created or updated DRA.
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
 *                   example: "DRA created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "123456"
 *                     email:
 *                       type: string
 *                       example: "admin@example.com"
 *       400:
 *         description: Bad request (e.g., email already exists when creating)
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/addDRA", addDRA);

/**
 * @swagger
 * /api/auth/addSettlor:
 *   post:
 *     summary: Create or Update Settlor
 *     description: Creates a new Settlor if isCreate is true, otherwise updates an existing Settlor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isCreate
 *               - data
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 example: true
 *               data:
 *                 type: object
 *                 required:
 *                   - settlorEmail
 *                 properties:
 *                   settlorName:
 *                     type: string
 *                     example: "Oando"
 *                   omlCode:
 *                     type: string
 *                     example: "om-876"
 *                   contactName:
 *                     type: string
 *                     example: "John"
 *                   contactEmail:
 *                     type: string
 *                     example: "admin@example.com"
 *                   contactPhoneNumber:
 *                     type: string
 *                     example: "090983763674"
 *     responses:
 *       200:
 *         description: Successfully created or updated DRA.
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
 *                   example: "Settlor created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     settlorId:
 *                       type: string
 *                       example: "123456"
 *                     contactEmail:
 *                       type: string
 *                       example: "admin@example.com"
 *       400:
 *         description: Bad request (e.g., email already exists when creating)
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/addSettlor", addSettlor);

/**
 * @swagger
 * /api/auth/test:
 *   get:
 *     summary: Entry Point
 *     description: This is just a test route
 *     responses:
 *       200:
 *         description: Settlor.
 */
authRoutes.get("/test", test);

export default authRoutes