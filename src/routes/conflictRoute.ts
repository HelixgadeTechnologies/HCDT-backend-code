import express from "express";
import { getAllCauseOfConflict, getAllConflictStatuses, getAllCourtLitigationStatuses, getAllIssuesAddressedBy, getAllPartiesInvolve, getConflict, getConflictDashboard, getConflictViaTrust, handleConflict, listConflicts } from "../controllers/conflictController";


const conflictRouter = express.Router();


/**
 * @swagger
 * /api/conflict/create:
 *   post:
 *     summary: Create or update a conflict record
 *     description: If `isCreate` is true, a new conflict record is created. If false, an existing record is updated.
 *       **Note:** `ConflictId` can be ignored if `isCreate` is true but is required when `isCreate` is false.
 *     tags:
 *       - Conflict
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 description: Determines if a new record should be created or an existing one updated.
 *                 example: true
 *               data:
 *                 type: object
 *                 properties:
 *                   conflictId:
 *                     type: string
 *                     description: The unique ID of the conflict (required for update).
 *                     example: "existing-conflict-id"
 *                   projectId:
 *                     type: string
 *                     description: The ID of the related project.
 *                     example: "abc123"
 *                   causeOfConflictId:
 *                     type: integer
 *                     description: The ID of the cause of the conflict.
 *                     example: 1
 *                   partiesInvolveId:
 *                     type: integer
 *                     description: The ID of the parties involved in the conflict.
 *                     example: 2
 *                   narrateIssues:
 *                     type: string
 *                     description: A description of the conflict issue.
 *                     example: "Dispute over project ownership"
 *                   conflictStatusId:
 *                     type: integer
 *                     description: The ID of the conflict status.
 *                     example: 3
 *                   issuesAddressById:
 *                     type: integer
 *                     description: The ID of the authority addressing the issue.
 *                     example: 4
 *                   courtLitigationStatusId:
 *                     type: integer
 *                     description: The ID of the court litigation status.
 *                     example: 5
 *     responses:
 *       200:
 *         description: Conflict record created or updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Conflict created successfully"
 *               data:
 *                 ConflictId: "newly-generated-id"
 *                 projectId: "abc123"
 *                 userId: "user456"
 *                 causeOfConflictId: 1
 *                 partiesInvolveId: 2
 *                 narrateIssues: "Dispute over project ownership"
 *                 conflictStatusId: 3
 *                 issuesAddressById: 4
 *                 courtLitigationStatusId: 5
 *       400:
 *         description: Bad request, missing required fields.
 *         content:
 *           application/json:
 *             example:
 *               message: "Conflict ID is required for updating a record."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */
conflictRouter.post("/create", handleConflict);

/**
 * @swagger
 * /api/conflict/conflicts:
 *   get:
 *     summary: Retrieve a list of all conflicts
 *     description: Returns a list of all conflict records including related details.
 *     tags:
 *       - Conflict
 *     responses:
 *       200:
 *         description: Successfully retrieved list of conflicts.
 *         content:
 *           application/json:
 *             example:
 *               message: "Conflicts retrieved successfully"
 *               data: 
 *                 - ConflictId: "uuid1"
 *                   projectId: "proj123"
 *                   userId: "user456"
 *                   causeOfConflictId: 1
 *                   partiesInvolveId: 2
 *                   narrateIssues: "Dispute over project ownership"
 *                   conflictStatusId: 3
 *                   issuesAddressById: 4
 *                   courtLitigationStatusId: 5
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */
conflictRouter.get("/conflicts", listConflicts);

/**
 * @swagger
 * /api/conflict/conflict-view/{conflictId}:
 *   get:
 *     summary: Get a specific conflict by ID
 *     description: Fetches a conflict record from the conflict view by its ID.
 *     tags:
 *       - Conflict
 *     parameters:
 *       - in: path
 *         name: conflictId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the conflict
 *     responses:
 *       200:
 *         description: Successfully retrieved conflict
 *       400:
 *         description: Conflict ID is required
 *       404:
 *         description: Conflict not found
 *       500:
 *         description: Internal server error
 */
conflictRouter.get("/conflict-view/:conflictId", getConflict);
/**
 * @swagger
 * /api/conflict/conflict-by-trust/{trustId}:
 *   get:
 *     summary: Get a specific trust by ID
 *     description: Fetches a conflict record from the conflict view by trust ID.
 *     tags:
 *       - Conflict
 *     parameters:
 *       - in: path
 *         name: trustId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the conflict
 *     responses:
 *       200:
 *         description: Successfully retrieved conflict
 *       400:
 *         description: Conflict ID is required
 *       404:
 *         description: Conflict not found
 *       500:
 *         description: Internal server error
 */
conflictRouter.get("/conflict-by-trust/:trustId", getConflictViaTrust);

/**
 * @swagger
 * /api/conflict/causeOfConflict:
 *   get:
 *     summary: Get all CauseOfConflict
 *     tags:
 *       - Conflict
 *     responses:
 *       200:
 *         description: List of causeOfConflict
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
conflictRouter.get("/causeOfConflict", getAllCauseOfConflict);
/**
 * @swagger
 * /api/conflict/partiesInvolve:
 *   get:
 *     summary: Get all partiesInvolve
 *     tags:
 *       - Conflict
 *     responses:
 *       200:
 *         description: List of partiesInvolve
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
conflictRouter.get("/partiesInvolve", getAllPartiesInvolve);
/**
 * @swagger
 * /api/conflict/conflictStatuses:
 *   get:
 *     summary: Get all conflictStatuses
 *     tags:
 *       - Conflict
 *     responses:
 *       200:
 *         description: List of conflictStatuses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
conflictRouter.get("/conflictStatuses", getAllConflictStatuses);
/**
 * @swagger
 * /api/conflict/issuesAddressedBy:
 *   get:
 *     summary: Get all issuesAddressedBy
 *     tags:
 *       - Conflict
 *     responses:
 *       200:
 *         description: List of issuesAddressedBy
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
conflictRouter.get("/issuesAddressedBy", getAllIssuesAddressedBy);
/**
 * @swagger
 * /api/conflict/courtLitigationStatuses:
 *   get:
 *     summary: Get all courtLitigationStatuses
 *     tags:
 *       - Conflict
 *     responses:
 *       200:
 *         description: List of courtLitigationStatuses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
conflictRouter.get("/courtLitigationStatuses", getAllCourtLitigationStatuses);


/**
 * @swagger
 * /api/conflict/dashboard/{trustId}/{year}/{state}/{settlor}:
 *   get:
 *     summary: Get conflict dashboard data
 *     description: |
 *       Returns pie chart data for various metrics (conflict status, court litigation, etc.)linked to a specific projectId.  
 *       **Note:** At default a dashboard must preview all data to archive this pass in `ALL` as trustId, then to sort bse on project id pass in the trustId e.g `5792b700-c692-46a4-a5c0-129664cf751f` to interact it base on a specific trust.
 *     tags:
 *       - Conflict
 *     parameters: 
 *       - name: trustId
 *         in: path
 *         required: true
 *         description: The unique identifier for the trust
 *         schema:
 *           type: string
 *       - name: year
 *         in: path
 *         required: true
 *         description: Filter by year
 *         schema:
 *           type: number
 *       - name: state
 *         in: path
 *         required: true
 *         description: Filter by state
 *         schema:
 *           type: string
 *       - name: settlor
 *         in: path
 *         required: true
 *         description: Filter by settlor
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
 *                 ALL_CONFLICT_REPORT:
 *                   type: array
 *                   items:
 *                     type: object
 *                 RESOLVED_CONFLICT:
 *                   type: array
 *                   items:
 *                     type: object
 *                 PENDING_CONFLICT:
 *                   type: array
 *                   items:
 *                     type: object
 *                 CONFLICTS_IN_COURT:
 *                   type: array
 *                   items:
 *                     type: object
 *                 STATUS_OF_CONFLICT:
 *                   type: array
 *                   items:
 *                     type: object
 *                 CONFLICT_OF_COURT_LITIGATION:
 *                   type: array
 *                   items:
 *                     type: object
 *                 CAUSE_OF_CONFLICT:
 *                   type: array
 *                   items:
 *                     type: object
 *                 RESOLVED_CONFLICTS:
 *                   type: array
 *                   items:
 *                     type: object
 *                 UNRESOLVED_CONFLICTS:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: trust Id is required
 *       500:
 *         description: Internal server error
 */
conflictRouter.get('/dashboard/:trustId/:year/:state/:settlor', getConflictDashboard);

export default conflictRouter;