import express from "express";
import { createOrUpdateAverageCommunitySatisfaction, getAllAcsOptionOne, getAllAcsOptionTwo, getAverageCommunitySatisfactionById, getAverageCommunitySatisfactionByTrustId, getDashboardData, listAverageCommunitySatisfaction } from "../controllers/averageCommunitySatisfactionController";

const averageCommunitySatisfactionRouter = express.Router();

/**
 * @swagger
 * /api/average-community-satisfaction/create:
 *   post:
 *     summary: Create or update an Average Community Satisfaction record
 *     description: Creates a new record if `isCreate` is true, otherwise updates an existing record.
 *       **Note:** `averageCommunitySatisfactionId` can be ignored if `isCreate` is true but is required when `isCreate` is false.
 *     tags: [Average Community Satisfaction]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
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
 *                 description: Determines if the request is for creation (true) or update (false). NOTE acsOptionTwo is the option for the first five properties while acsOptionOne goes to the last three.
 *                 example: true
 *               data:
 *                 type: object
 *                 required:
 *                   - averageCommunitySatisfactionId
 *                 properties:
 *                   averageCommunitySatisfactionId:
 *                     type: string
 *                     format: uuid
 *                     description: Unique identifier for the record.
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   infoProjects:
 *                     type: integer
 *                     nullable: true
 *                     description: Information projects count.
 *                     example: 3
 *                   communityConsult:
 *                     type: integer
 *                     nullable: true
 *                     description: Number of community consultations.
 *                     example: 5
 *                   localParticipation:
 *                     type: integer
 *                     nullable: true
 *                     description: Local participation score.
 *                     example: 8
 *                   reportMechanism:
 *                     type: integer
 *                     nullable: true
 *                     description: Report mechanism effectiveness score.
 *                     example: 7
 *                   conflictMinimization:
 *                     type: integer
 *                     nullable: true
 *                     description: Conflict minimization efforts score.
 *                     example: 6
 *                   projectHandover:
 *                     type: integer
 *                     nullable: true
 *                     description: Project handover satisfaction score.
 *                     example: 4
 *                   maintenanceConsult:
 *                     type: integer
 *                     nullable: true
 *                     description: Maintenance consultation count.
 *                     example: 2
 *                   incomeProject:
 *                     type: integer
 *                     nullable: true
 *                     description: Income generated from the project.
 *                     example: 1
 *                   trustId:
 *                     type: string
 *                     nullable: true
 *                     description: Associated trust identifier.
 *                     example: "abc123-trust"
 *     responses:
 *       200:
 *         description: Successfully created or updated the record.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Average Community Satisfaction created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     averageCommunitySatisfactionId:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     infoProjects:
 *                       type: integer
 *                       example: 3
 *                     communityConsult:
 *                       type: integer
 *                       example: 5
 *                     localParticipation:
 *                       type: integer
 *                       example: 8
 *                     reportMechanism:
 *                       type: integer
 *                       example: 7
 *                     conflictMinimization:
 *                       type: integer
 *                       example: 6
 *                     projectHandover:
 *                       type: integer
 *                       example: 4
 *                     maintenanceConsult:
 *                       type: integer
 *                       example: 2
 *                     incomeProject:
 *                       type: integer
 *                       example: 1
 *                     trustId:
 *                       type: string
 *                       example: "abc123-trust"
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request: isCreate must be a boolean."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
averageCommunitySatisfactionRouter.post("/create", createOrUpdateAverageCommunitySatisfaction);

/**
 * @swagger
 * /api/average-community-satisfaction/list:
 *   get:
 *     summary: Get all Average Community Satisfaction records
 *     description: Retrieves a list of all Average Community Satisfaction records from the database.
 *     tags:
 *       - Average Community Satisfaction
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of Average Community Satisfaction records.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "AverageCommunitySatisfactions"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/AverageCommunitySatisfactionView"
 *       400:
 *         description: No data found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Average Community Satisfaction Data not found"
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 *
 * components:
 *   schemas:
 *     AverageCommunitySatisfactionView:
 *       type: object
 *       properties:
 *         averageCommunitySatisfactionId:
 *           type: string
 *           format: uuid
 *         infoProjects:
 *           type: integer
 *           nullable: true
 *         communityConsult:
 *           type: integer
 *           nullable: true
 *         localParticipation:
 *           type: integer
 *           nullable: true
 *         reportMechanism:
 *           type: integer
 *           nullable: true
 *         conflictMinimization:
 *           type: integer
 *           nullable: true
 *         infoProjectsStatus:
 *           type: string
 *           nullable: true
 *         communityConsultStatus:
 *           type: string
 *           nullable: true
 *         localParticipationStatus:
 *           type: string
 *           nullable: true
 *         reportMechanismStatus:
 *           type: string
 *           nullable: true
 *         conflictMinimizationStatus:
 *           type: string
 *           nullable: true
 *         projectHandover:
 *           type: integer
 *           nullable: true
 *         maintenanceConsult:
 *           type: integer
 *           nullable: true
 *         incomeProject:
 *           type: integer
 *           nullable: true
 *         projectHandoverStatus:
 *           type: string
 *           nullable: true
 *         maintenanceConsultStatus:
 *           type: string
 *           nullable: true
 *         incomeProjectStatus:
 *           type: string
 *           nullable: true
 */
averageCommunitySatisfactionRouter.get("/list", listAverageCommunitySatisfaction);

/**
 * @swagger
 * /api/average-community-satisfaction/single/{averageCommunitySatisfactionId}:
 *   get:
 *     summary: Get Average Community Satisfaction by ID
 *     description: Retrieves a specific Average Community Satisfaction record by its unique ID.
 *     tags:
 *       - Average Community Satisfaction
 *     parameters:
 *       - in: path
 *         name: averageCommunitySatisfactionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique ID of the Average Community Satisfaction record.
 *     responses:
 *       200:
 *         description: Successfully retrieved the Average Community Satisfaction record.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "AverageCommunitySatisfaction"
 *                 data:
 *                   $ref: "#/components/schemas/AverageCommunitySatisfactionView"
 *       400:
 *         description: Missing required ID parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Average Community Satisfaction ID is required"
 *                 data:
 *                   type: string
 *                   nullable: true
 *       404:
 *         description: Record not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Average Community Satisfaction not found"
 *                 data:
 *                   type: string
 *                   nullable: true
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */
averageCommunitySatisfactionRouter.get("/single/:averageCommunitySatisfactionId", getAverageCommunitySatisfactionById);
/**
 * @swagger
 * /api/average-community-satisfaction/single-by-trust/{trustId}:
 *   get:
 *     summary: Get Average Community Satisfaction by Trust ID
 *     description: Retrieves all Average Community Satisfaction record by its unique Trust ID.
 *     tags:
 *       - Average Community Satisfaction
 *     parameters:
 *       - in: path
 *         name: trustId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique ID of the Trust record.
 *     responses:
 *       200:
 *         description: Successfully retrieved the Average Community Satisfaction record.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "AverageCommunitySatisfaction"
 *                 data:
 *                   $ref: "#/components/schemas/AverageCommunitySatisfactionView"
 *       400:
 *         description: Missing required ID parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Trust ID is required"
 *                 data:
 *                   type: string
 *                   nullable: true
 *       404:
 *         description: Record not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Average Community Satisfaction not found"
 *                 data:
 *                   type: string
 *                   nullable: true
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */
averageCommunitySatisfactionRouter.get("/single-by-trust/:trustId", getAverageCommunitySatisfactionByTrustId);

/**
 * @swagger
 * /api/average-community-satisfaction/acsOptionOne:
 *   get:
 *     summary: Get all AcsOptionOne
 *     tags:
 *       - Average Community Satisfaction
 *     responses:
 *       200:
 *         description: List of acsOptionOne
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
averageCommunitySatisfactionRouter.get("/acsOptionOne", getAllAcsOptionOne);
/**
 * @swagger
 * /api/average-community-satisfaction/acsOptionTwo:
 *   get:
 *     summary: Get all AcsOptionTwo
 *     tags:
 *       - Average Community Satisfaction
 *     responses:
 *       200:
 *         description: List of acsOptionTwo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
averageCommunitySatisfactionRouter.get("/acsOptionTwo", getAllAcsOptionTwo);


/**
 * @swagger
 * /api/average-community-satisfaction/dashboard/{trustId}:
 *   get:
 *     summary: Get community satisfaction dashboard data
 *     description: Returns pie chart data for various metrics (infoProjects, communityConsult, etc.) linked to a specific trustId.
 *       **Note:** At default a dashboard must preview all data, to archive this pass in `ALL` as trustId, then to sort base on trust, pass in the trustId e.g `5792b700-c692-46a4-a5c0-129664cf751f` to interact it base on a specific trust.
 *     tags:
 *       - Average Community Satisfaction
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
 *                 infoProjects:
 *                   type: array
 *                   items:
 *                     type: object
 *                 communityConsult:
 *                   type: array
 *                   items:
 *                     type: object
 *                 localParticipation:
 *                   type: array
 *                   items:
 *                     type: object
 *                 reportMechanism:
 *                   type: array
 *                   items:
 *                     type: object
 *                 conflictMinimization:
 *                   type: array
 *                   items:
 *                     type: object
 *                 projectHandover:
 *                   type: array
 *                   items:
 *                     type: object
 *                 maintenanceConsult:
 *                   type: array
 *                   items:
 *                     type: object
 *                 incomeProject:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: trust Id is required
 *       500:
 *         description: Internal server error
 */
averageCommunitySatisfactionRouter.get('/dashboard/:trustId', getDashboardData);
export default averageCommunitySatisfactionRouter;