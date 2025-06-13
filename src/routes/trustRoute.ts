import { Router } from "express";
import { addTrustEstablishmentST, createTrust, deleteCACFile, deleteMatrixFile, deleteTrust, fundsDashboard, getAll, getSpecificTrustEstablishmentST, getTrustInfo, trustEstablishmentDashboard } from "../controllers/trustController";
const trustRoutes: Router = Router();

/**
 * @swagger
 * /api/trust/createTrust:
 *   post:
 *     summary: Create or update a trust
 *     tags: [Trust]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     description: |
 *       Creates a new Trust if `isCreate` is true, otherwise updates an existing Trust.  
 *       **Note:** `trustId` can be ignored if `isCreate` is true but is required when `isCreate` is false.
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
 *                   - trustName
 *                 properties:
 *                   trustId:
 *                     type: string
 *                     example: "17b5914e-092d-46ad-a851-5c01f795265e"
 *                   trustName:
 *                     type: string
 *                     example: "My Trust"
 *                   settlor:
 *                     type: string
 *                     example: "Oando,NNPC2"
 *                   nameOfOmls:
 *                     type: string
 *                     example: "OML-1, OML-2"
 *                   userId:
 *                     type: string
 *                     example: "241f4f14-0d24-429c-82c6-aa4a505ff3b8"
 *                   country:
 *                     type: string
 *                     example: "Nigeria"
 *                   state:
 *                     type: string
 *                     example: "Lagos"
 *                   localGovernmentArea:
 *                     type: string
 *                     example: "Ikeja"
 *                   trustCommunities:
 *                     type: string
 *                     example: "Community A, Community B"
 *                   botDetailsOneFirstName:
 *                     type: string
 *                     example: "joe"
 *                   botDetailsOneLastName:
 *                     type: string
 *                     example: "Ben"
 *                   botDetailsOneEmail:
 *                     type: string
 *                     example: "joe@example.com"
 *                   botDetailsOnePhoneNumber:
 *                     type: string
 *                     example: "09036103607"
 *                   botDetailsTwoFirstName:
 *                     type: string
 *                     example: "Sam"
 *                   botDetailsTwoLastName:
 *                     type: string
 *                     example: "Davis"
 *                   botDetailsTwoEmail:
 *                     type: string
 *                     example: "sam@example.com"
 *                   botDetailsTwoPhoneNumber:
 *                     type: string
 *                     example: "09036103607"
 *                   totalMaleBotMembers:
 *                     type: integer
 *                     example: 10
 *                   totalFemaleBotMembers:
 *                     type: integer
 *                     example: 8
 *                   totalPwdBotMembers:
 *                     type: integer
 *                     example: 2
 *                   totalMaleAdvisoryCommitteeMembers:
 *                     type: integer
 *                     example: 5
 *                   totalFemaleAdvisoryCommitteeMembers:
 *                     type: integer
 *                     example: 4
 *                   totalPwdAdvisoryCommitteeMembers:
 *                     type: integer
 *                     example: 1
 *                   totalMaleManagementCommitteeMembers:
 *                     type: integer
 *                     example: 6
 *                   totalFemaleManagementCommitteeMembers:
 *                     type: integer
 *                     example: 3
 *                   totalPwdManagementCommitteeMembers:
 *                     type: integer
 *                     example: 1
 *     responses:
 *       200:
 *         description: Trust created or updated successfully
 *       400:
 *         description: Bad request (e.g., missing required fields or validation errors)
 *       500:
 *         description: Internal server error
 */
trustRoutes.post("/createTrust", createTrust);

/**
 * @swagger
 * /api/trust/all:
 *   get:
 *     summary: Get all trusts
 *     tags: [Trust]
 *     description: Fetches all trusts from the database.
 *     responses:
 *       200:
 *         description: A list of trusts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   trustId:
 *                     type: string
 *                     example: "uuid-trust-id"
 *                   trustName:
 *                     type: string
 *                     example: "My Trust"
 *                   settlorId:
 *                     type: string
 *                     example: "uuid-settlor-id"
 *                   userId:
 *                     type: string
 *                     example: "uuid-user-id"
 *                   country:
 *                     type: string
 *                     example: "Nigeria"
 *                   state:
 *                     type: string
 *                     example: "Lagos"
 *                   localGovernmentArea:
 *                     type: string
 *                     example: "Ikeja"
 *                   trustCommunities:
 *                     type: string
 *                     example: "Community A, Community B"
 *                   totalMaleBotMembers:
 *                     type: integer
 *                     example: 10
 *                   totalFemaleBotMembers:
 *                     type: integer
 *                     example: 8
 *                   totalPwdBotMembers:
 *                     type: integer
 *                     example: 2
 *                   totalMaleAdvisoryCommitteeMembers:
 *                     type: integer
 *                     example: 5
 *                   totalFemaleAdvisoryCommitteeMembers:
 *                     type: integer
 *                     example: 4
 *                   totalPwdAdvisoryCommitteeMembers:
 *                     type: integer
 *                     example: 1
 *                   totalMaleManagementCommitteeMembers:
 *                     type: integer
 *                     example: 6
 *                   totalFemaleManagementCommitteeMembers:
 *                     type: integer
 *                     example: 3
 *                   totalPwdManagementCommitteeMembers:
 *                     type: integer
 *                     example: 1
 *       500:
 *         description: Internal server error
 */
trustRoutes.get("/all", getAll);

/**
 * @swagger
 * /api/trust/trust/{trustId}:
 *   get:
 *     summary: Get a trust by ID
 *     tags: [Trust]
 *     description: Fetches a specific trust from the database using its trustId.
 *     parameters:
 *       - in: path
 *         name: trustId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the trust
 *     responses:
 *       200:
 *         description: A trust object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trustId:
 *                   type: string
 *                   example: "uuid-trust-id"
 *                 trustName:
 *                   type: string
 *                   example: "My Trust"
 *                 settlorId:
 *                   type: string
 *                   example: "uuid-settlor-id"
 *                 userId:
 *                   type: string
 *                   example: "uuid-user-id"
 *                 country:
 *                   type: string
 *                   example: "Nigeria"
 *                 state:
 *                   type: string
 *                   example: "Lagos"
 *                 localGovernmentArea:
 *                   type: string
 *                   example: "Ikeja"
 *                 trustCommunities:
 *                   type: string
 *                   example: "Community A, Community B"
 *                 totalMaleBotMembers:
 *                   type: integer
 *                   example: 10
 *                 totalFemaleBotMembers:
 *                   type: integer
 *                   example: 8
 *                 totalPwdBotMembers:
 *                   type: integer
 *                   example: 2
 *                 totalMaleAdvisoryCommitteeMembers:
 *                   type: integer
 *                   example: 5
 *                 totalFemaleAdvisoryCommitteeMembers:
 *                   type: integer
 *                   example: 4
 *                 totalPwdAdvisoryCommitteeMembers:
 *                   type: integer
 *                   example: 1
 *                 totalMaleManagementCommitteeMembers:
 *                   type: integer
 *                   example: 6
 *                 totalFemaleManagementCommitteeMembers:
 *                   type: integer
 *                   example: 3
 *                 totalPwdManagementCommitteeMembers:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Trust not found
 *       500:
 *         description: Internal server error
 */
trustRoutes.get("/trust/:trustId", getTrustInfo);

/**
 * @swagger
 * /api/trust/remove:
 *   post:
 *     summary: Delete a trust by ID
 *     tags: [Trust]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trustId
 *             properties:
 *               trustId:
 *                 type: string
 *                 example: "17b5914e-092d-46ad-a851-5c01f795265e"
 *     responses:
 *       200:
 *         description: Trust successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trust deleted successfully"
 *                 trust:
 *                   type: object
 *       400:
 *         description: Bad request (missing userId)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
trustRoutes.post("/remove", deleteTrust);

/**
 * @swagger
 * /api/trust/addEstablishmentStatus:
 *   post:
 *     summary: Create or update a Trust Establishment Status
 *     description: If the trust establishment status exists, it updates the record; otherwise, it creates a new one.
 *     tags: [Trust]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trustEstablishmentStatusId:
 *                 type: string
 *                 description: The unique identifier for the trust establishment status (required for update).
 *               trustId:
 *                 type: string
 *                 description: The unique identifier for the trust.
 *               trustRegisteredWithCAC:
 *                 type: integer
 *               cscDocument:
 *                 type: string
 *                 description: Hex string representation of the CSC document.
 *               cscDocumentMimeType:
 *                 type: string
 *                 description: The MIME type of the CSC document.
 *               yearIncorporated:
 *                 type: integer
 *               botConstitutedAndInaugurated:
 *                 type: integer
 *               managementCommitteeConstitutedAndInaugurated:
 *                 type: integer
 *               advisoryCommitteeConstitutedAndInaugurated:
 *                 type: integer
 *               isTrustDevelopmentPlanReadilyAvailable:
 *                 type: integer
 *               isTrustDevelopmentPlanBudgetReadilyAvailable:
 *                 type: integer
 *               yearDeveloped:
 *                 type: integer
 *               yearExpired:
 *                 type: integer
 *               developmentPlanDocument:
 *                 type: string
 *                 description: Hex string representation of the development plan document.
 *               developmentPlanDocumentMimeType:
 *                 type: string
 *                 description: The MIME type of the development plan document.
 *               developmentPlanBudgetDocument:
 *                 type: string
 *                 description: Hex string representation of the development plan budget document.
 *               developmentPlanBudgetDocumentMimeType:
 *                 type: string
 *                 description: The MIME type of the development plan budget document.

 *               admin:
 *                 type: string
 *                 description: User ID of the admin.
 *               yearOfNeedsAssessment:
 *                 type: integer
 *               statusOfNeedAssessment:
 *                 type: integer
 *               communityWomenConsulted:
 *                 type: integer
 *               pwDsConsulted:
 *                 type: integer
 *               communityYouthsConsulted:
 *                 type: integer
 *               communityLeadershipConsulted:
 *                 type: integer
 *               attendanceSheet:
 *                 type: integer
 *               distributionMatrixDevelopedBySettlor:
 *                 type: boolean
 *               trustDistributionMatrixDocument:
 *                 type: string
 *                 description: Hex string representation of the trust distribution matrix document.
 *               trustDistributionMatrixDocumentMimeType:
 *                 type: string
 *                 description: The MIME type of the trust distribution matrix document.
 *               settlorOperationalExpenditures:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/OperationalExpenditure"
 *               fundsReceive:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/FundsReceived"
 *     responses:
 *       201:
 *         description: Successfully created or updated the trust establishment status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trustEstablishmentStatusId:
 *                   type: string
 *                 trustId:
 *                   type: string
 *       400:
 *         description: Bad request, invalid input.
 *       500:
 *         description: Internal server error.
 */
trustRoutes.post("/addEstablishmentStatus", addTrustEstablishmentST);

/**
 * @swagger
 * /api/trust/establishmentStatus/{trustId}:
 *   get:
 *     summary: Get Trust Establishment Status By ID
 *     description: Retrieves the trust establishment status and associated operational expenditures for a given trust ID.
 *     tags: [Trust]
 *     parameters:
 *       - in: path   # Changed from "query" to "path"
 *         name: trustId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the trust.
 *     responses:
 *       200:
 *         description: Trust establishment status retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trustId:
 *                   type: string
 *                   description: Unique identifier for the trust.
 *                 trustEstablishmentStatusId:
 *                   type: string
 *                   description: Unique identifier for the trust establishment status.
 *                 cscDocument:
 *                   type: string
 *                   nullable: true
 *                   description: Hex-encoded CSC document.
 *                 developmentPlanDocument:
 *                   type: string
 *                   nullable: true
 *                   description: Hex-encoded development plan document.
 *                 developmentPlanBudgetDocument:
 *                   type: string
 *                   nullable: true
 *                   description: Hex-encoded development plan budget document.
 *                 trustDistributionMatrixDocument:
 *                   type: string
 *                   nullable: true
 *                   description: Hex-encoded trust distribution matrix document.
 *                 settlorOperationalExpenditures:
 *                   type: array
 *                   description: List of operational expenditures.
 *                   items:
 *                     type: object
 *                     properties:
 *                       operationalExpenditureId:
 *                         type: string
 *                         description: Unique identifier for the operational expenditure.
 *                       trustEstablishmentStatusId:
 *                         type: string
 *                         description: Associated trust establishment status ID.
 *                       amount:
 *                         type: number
 *                         description: Amount spent.
 *       404:
 *         description: Trust establishment status not found.
 *       500:
 *         description: Internal server error.
 */
trustRoutes.get("/establishmentStatus/:trustId", getSpecificTrustEstablishmentST);

/**
 * @swagger
 * /api/trust/remove-cac-file/{establishmentId}:
 *   delete:
 *     summary: Remove the CAC file for a trust establishment.
 *     description: Sets the cscDocument and its MIME type to null for the given trust establishment.
 *     tags:
 *       - Trust
 *     parameters:
 *       - in: path
 *         name: establishmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trust establishment.
 *     responses:
 *       200:
 *         description: CAC file removed successfully.
 *       500:
 *         description: Server error while removing the CAC file.
 */
trustRoutes.delete('/remove-cac-file/:establishmentId', deleteCACFile);



/**
 * @swagger
 * /api/trust/remove-matrix-file/{establishmentId}:
 *   delete:
 *     summary: Remove the matrix file for a trust establishment.
 *     description: Sets the trustDistributionMatrixDocument and its MIME type to null for the given trust establishment.
 *     tags:
 *       - Trust
 *     parameters:
 *       - in: path
 *         name: establishmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trust establishment.
 *     responses:
 *       200:
 *         description: Matrix file removed successfully.
 *       500:
 *         description: Server error while removing the matrix file.
 */
trustRoutes.delete('/remove-matrix-file/:establishmentId', deleteMatrixFile);






/**
 * @swagger
 * /api/trust/dashboard/{trustId}:
 *   get:
 *     summary: Get project dashboard data
 *     description: |
 *       Returns pie chart data for various metrics for trust establishment dashboard.  
 *       **Note:** Pass in the trustId e.g `5792b700-c692-46a4-a5c0-129664cf751f` to interact it base on a specific trust.
 *     tags:
 *       - Trust
 *     parameters:
 *       - name: trustId
 *         in: path
 *         required: true
 *         description: The unique identifier for the trust
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 SUB_FIELDS:
 *                   type: array
 *                   items:
 *                     type: object
 *                 OPERATION_YEAR:
 *                   type: array
 *                   items:
 *                     type: object
 *                 TRENDS:
 *                   type: array
 *                   items:
 *                     type: object

 *       400:
 *         description: trust Id is required
 *       500:
 *         description: Internal server error
 */
trustRoutes.get('/dashboard/:trustId', trustEstablishmentDashboard);

/**
 * @swagger
 * /api/trust/fundsDashboard/{trustId}/{year}:
 *   get:
 *     summary: Get funds dashboard data for a specific trust and year
 *     tags:
 *       - Trust
 *     parameters:
 *       - in: path
 *         name: trustId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trust
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: The year to filter the data (use 0 for all years)
 *     responses:
 *       200:
 *         description: Funds dashboard data retrieved successfully
 *       404:
 *         description: Trust ID is required
 *       500:
 *         description: Server error while retrieving funds dashboard data
 */
trustRoutes.get('/fundsDashboard/:trustId/:year', fundsDashboard);


export default trustRoutes