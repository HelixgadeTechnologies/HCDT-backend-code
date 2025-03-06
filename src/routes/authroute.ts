import { Router } from "express";
import { addAdmin, addDRA, addNuprc, addSettlor, deleteSettlor, deleteUser, listAllAdmin, listAllDRA, listAllNUPRC, listAllSettlor, login, register, test } from "../controllers/authController";

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
 * /api/auth/remove:
 *   post:
 *     summary: Delete a user by ID
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "17b5914e-092d-46ad-a851-5c01f795265e"
 *     responses:
 *       200:
 *         description: User successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *                 user:
 *                   type: object
 *       400:
 *         description: Bad request (missing userId)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/remove", deleteUser)

/**
 * @swagger
 * /api/auth/addAdmin:
 *   post:
 *     summary: Create or Update an Admin
 *     tags: [Auth]
 *     description: |
 *       Creates a new Admin if `isCreate` is true, otherwise updates an existing Admin.  
 *       **Note:** `userId` can be ignored if `isCreate` is true but is required when `isCreate` is false.
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
 *                   userId:
 *                     type: string
 *                     example: "17b5914e-092d-46ad-a851-5c01f795265e"
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
 *                   trusts:
 *                     type: string
 *                     example: "uuid-trust-id-1, uuid-trust-id-2"
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
 * /api/auth/admin:
 *   get:
 *     summary: Retrieve all admin users
 *     tags: [Auth]  
 *     description: Returns a list of users with roles `SUPER ADMIN` or `ADMIN`
 *     responses:
 *       200:
 *         description: A list of admin users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: "17b5914e-092d-46ad-a851-5c01f795265e"
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *                   role:
 *                     type: string
 *                     example: "ADMIN"
 *       500:
 *         description: Internal server error
 */
authRoutes.get("/admin", listAllAdmin);

/**
 * @swagger
 * /api/auth/addnuprc:
 *   post:
 *     summary: Create or Update NUPRC-ADR
 *     tags: [Auth]
 *     description: |
 *       Creates a new NUPRC-ADR if `isCreate` is true, otherwise updates an existing NUPRC-ADR.  
 *       **Note:** `userId` can be ignored if `isCreate` is true but is required when `isCreate` is false.
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
 *                   userId:
 *                     type: string
 *                     example: "17b5914e-092d-46ad-a851-5c01f795265e"
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
authRoutes.post("/addnuprc", addNuprc);

/**
 * @swagger
 * api/auth/allnuprc:
 *   get:
 *     summary: Retrieve all NUPRC-ADR users
 *     tags: [Auth] 
 *     description: Returns a list of users with the role `NUPRC-ADR`
 *     responses:
 *       200:
 *         description: A list of NUPRC-ADR users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: "c8f6e2a3-1234-5678-90ab-cdef12345678"
 *                   firstName:
 *                     type: string
 *                     example: "Alice"
 *                   lastName:
 *                     type: string
 *                     example: "Smith"
 *                   email:
 *                     type: string
 *                     example: "alice.smith@example.com"
 *                   role:
 *                     type: string
 *                     example: "NUPRC-ADR"
 *       500:
 *         description: Internal server error
 */
authRoutes.get("/allnuprc", listAllNUPRC);

/**
 * @swagger
 * /api/auth/addDRA:
 *   post:
 *     summary: Create or Update DRA
 *     tags: [Auth]
 *     description: |
 *       Creates a new DRA if `isCreate` is true, otherwise updates an existing DRA.  
 *       **Note:** `userId` can be ignored if `isCreate` is true but is required when `isCreate` is false.
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
 *                   userId:
 *                     type: string
 *                     example: "17b5914e-092d-46ad-a851-5c01f795265e"
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
 * /api/auth/allDra:
 *   get:
 *     summary: Retrieve all DRA users
 *     tags: [Auth] 
 *     description: Returns a list of users with the role `DRA`
 *     responses:
 *       200:
 *         description: A list of DRA users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: "b7e3d2f5-6789-1234-abcd-ef5678901234"
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *                   role:
 *                     type: string
 *                     example: "DRA"
 *       500:
 *         description: Internal server error
 */
authRoutes.get("/allDra", listAllDRA);

/**
 * @swagger
 * /api/auth/addSettlor:
 *   post:
 *     summary: Create or Update Settlor
 *     tags: [Auth]
*     description: |
 *       Creates a new Settlor if `isCreate` is true, otherwise updates an existing Settlor.  
 *       **Note:** `settlorId` can be ignored if `isCreate` is true but is required when `isCreate` is false.
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
 *                   settlorId:
 *                     type: string
 *                     example: "17b5914e-092d-46ad-a851-5c01f795265e"
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
 *         description: Successfully created or updated Settlor.
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
 * /api/auth/allSettlor:
 *   get:
 *     summary: Retrieve all settlors
 *     tags: [Auth]  
 *     description: Returns a list of all settlors
 *     responses:
 *       200:
 *         description: A list of settlors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   settlorId:
 *                     type: string
 *                     example: "e1a2b3c4-5678-9101-1121-314151617181"
 *                   settlorName:
 *                     type: string
 *                     example: "John Settlor"
 *                   omlCode:
 *                     type: string
 *                     example: "OML-123"
 *                   contactName:
 *                     type: string
 *                     example: "Jane Doe"
 *                   contactEmail:
 *                     type: string
 *                     example: "jane.doe@example.com"
 *                   contactPhoneNumber:
 *                     type: string
 *                     example: "+2348012345678"
 *       500:
 *         description: Internal server error
 */
authRoutes.get("/allSettlor", listAllSettlor);

/**
 * @swagger
 * /api/auth/removeSettlor:
 *   post:
 *     summary: Remove a Settlor
 *     tags: [Auth]
 *     description: Deletes a settlor by settlorId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               settlorId:
 *                 type: string
 *                 example: "e1a2b3c4-5678-9101-1121-314151617181"
 *     responses:
 *       200:
 *         description: Settlor successfully removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Settlor removed successfully"
 *       400:
 *         description: Settlor ID is missing
 *       404:
 *         description: Settlor not found
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/removeSettlor", deleteSettlor);

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