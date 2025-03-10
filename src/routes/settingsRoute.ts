import { Router } from "express";
import { addAdmin, addDRA, addNuprc, addSettlor, changeUserPassword, deleteSettlor, deleteUser, getRoles, getUser, listAllAdmin, listAllDRA, listAllNUPRC, listAllSettlor, updateUserProfilePicture } from "../controllers/authController";

const settingsRoute: Router = Router();
/**
 * @swagger
 * /api/setting/getUser/{userId}:
 *   get:
 *     summary: Retrieve user details by user ID
 *     tags: [Setting]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User found successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "17b5914e-092d-46ad-a851-5c01f795265e"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     profilePic:
 *                       type: string
 *                       description: Profile picture in hex format
 *                       example: "4a6f686e446f65"
 *       400:
 *         description: Bad request (User ID missing or user not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User ID is required"
 *       500:
 *         description: Internal server error
 */
settingsRoute.get("/getUser/:userId", getUser)

/**
 * @swagger
 * /api/setting/remove:
 *   post:
 *     summary: Delete a user by ID
 *     tags: [Setting]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
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
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
settingsRoute.post("/remove", deleteUser)

/**
 * @swagger
 * /api/setting/addAdmin:
 *   post:
 *     summary: Create or Update an Admin
 *     tags: [Setting]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
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
 *                     example: "uuid-user-id"
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
settingsRoute.post("/addAdmin", addAdmin);

/**
 * @swagger
 * /api/setting/admins:
 *   get:
 *     summary: Retrieve all admin users
 *     tags: [Setting]  
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
settingsRoute.get("/admins", listAllAdmin);

/**
 * @swagger
 * /api/setting/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Setting]
 *     responses:
 *       200:
 *         description: Successfully retrieved roles
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
 *                   example: "Roles"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       roleId:
 *                         type: string
 *                         example: "17b5914e-092d-46ad-a851-5c01f795265e"
 *                       roleName:
 *                         type: string
 *                         example: "Admin"
 *                       roleOrder:
 *                         type: integer
 *                         example: 1
 *       400:
 *         description: Internal server error
 */
settingsRoute.get("/roles", getRoles);

/**
 * @swagger
 * /api/setting/addnuprc:
 *   post:
 *     summary: Create or Update NUPRC-ADR
 *     tags: [Setting]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
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
settingsRoute.post("/addnuprc", addNuprc);

/**
 * @swagger
 * api/setting/allnuprc:
 *   get:
 *     summary: Retrieve all NUPRC-ADR users
 *     tags: [Setting] 
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
settingsRoute.get("/allnuprc", listAllNUPRC);

/**
 * @swagger
 * /api/setting/addDRA:
 *   post:
 *     summary: Create or Update DRA
 *     tags: [Setting]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
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
settingsRoute.post("/addDRA", addDRA);

/**
 * @swagger
 * /api/setting/allDra:
 *   get:
 *     summary: Retrieve all DRA users
 *     tags: [Setting] 
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
settingsRoute.get("/allDra", listAllDRA);

/**
 * @swagger
 * /api/setting/addSettlor:
 *   post:
 *     summary: Create or Update Settlor
 *     tags: [Setting]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
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
settingsRoute.post("/addSettlor", addSettlor);

/**
 * @swagger
 * /api/setting/allSettlor:
 *   get:
 *     summary: Retrieve all settlors
 *     tags: [Setting]  
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
settingsRoute.get("/allSettlor", listAllSettlor);

/**
 * @swagger
 * /api/setting/removeSettlor:
 *   post:
 *     summary: Remove a Settlor
 *     tags: [Setting]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
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
settingsRoute.post("/removeSettlor", deleteSettlor);

/**
 * @swagger
 * /api/setting/change-password:
 *   post:
 *     summary: Change user password
 *     description: Change user password
 *     tags: [Setting]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The current password of the user.
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set.
 *               confirmPassword:
 *                 type: string
 *                 description: Must match the new password.
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Bad request (invalid input).
 *       401:
 *         description: Unauthorized (wrong old password).
 *       500:
 *         description: Internal server error.
 */
settingsRoute.post("/change-password", changeUserPassword);

/**
 * @swagger
 * /api/setting/update-profile-picture:
 *   post:
 *     summary: Update user profile picture
 *     description: Update user profile picture
 *     tags: [Setting]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hexImage
 *               - mimeType
 *             properties:
 *               hexImage:
 *                 type: string
 *                 example: "89504e470d0a1a0a0000000d49484452..."
 *                 description: The profile picture in HEX format.
 *               mimeType:
 *                 type: string
 *                 example: "image/png"
 *                 description: The MIME type of the image (e.g., image/png, image/jpeg).
 *     responses:
 *       200:
 *         description: Profile picture updated successfully.
 *       400:
 *         description: Bad request (invalid input).
 *       401:
 *         description: Unauthorized (user not authenticated).
 *       500:
 *         description: Internal server error.
 */
settingsRoute.post("/update-profile-picture", updateUserProfilePicture);

export default settingsRoute