import express from "express";
import { addOrUpdateProject, getProject, getProjectCategories, getQualityRatings, getStatusReports, getTypeOfWork, listProjects } from "../controllers/projectController";


const projectRouter = express.Router();

/**
 * @swagger
 * /api/project/save:
 *   post:
 *     summary: Create or update a project
 *     description: If `isCreate` is `true`, it creates a new project; otherwise, it updates an existing project.
 *       **Note:** `projectId` can be ignored if `isCreate` is true but is required when `isCreate` is false.
 *     tags:
 *       - Project
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
 *                 example: true
 *               data:
 *                 type: object
 *                 properties:
 *                   projectId:
 *                     type: string
 *                     example: "fkfiifi"
 *                   projectTitle:
 *                     type: string
 *                     example: "Solar Energy Installation"
 *                   projectCategoryId:
 *                     type: integer
 *                     example: 1
 *                   totalBudget:
 *                     type: integer
 *                     example: 5000000
 *                   community:
 *                     type: string
 *                     example: "Lagos Community"
 *                   awardDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-01T00:00:00.000Z"
 *                   nameOfContractor:
 *                     type: string
 *                     example: "ABC Contractors Ltd"
 *                   annualApprovedBudget:
 *                     type: string
 *                     example: "500000"
 *                   projectStatus:
 *                     type: integer
 *                     example: 2
 *                   qualityRatingId:
 *                     type: integer
 *                     example: 3
 *                   projectVideo:
 *                     type: string
 *                     description: "Hex string representing video data"
 *                     example: "0xabcdef"
 *                   projectVideoMimeType:
 *                     type: string
 *                     example: "video/mp4"
 *                   numberOfMaleEmployedByContractor:
 *                     type: integer
 *                     example: 10
 *                   numberOfFemaleEmployedByContractor:
 *                     type: integer
 *                     example: 5
 *                   numberOfPwDsEmployedByContractor:
 *                     type: integer
 *                     example: 2
 *                   typeOfWork:
 *                     type: string
 *                     example: "Electrical"
 *                   numberOfHostCommunityMemberContracted:
 *                     type: integer
 *                     example: 15
 *                   numberOfMaleBenefited:
 *                     type: integer
 *                     example: 100
 *                   numberOfFemaleBenefited:
 *                     type: integer
 *                     example: 50
 *                   numberOfPwDsBenefited:
 *                     type: integer
 *                     example: 5
 *                   trustId:
 *                     type: string
 *                     example: "trust-12345"
 *     responses:
 *       201:
 *         description: Successfully created or updated the project
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
 *                   example: "Project created successfully"
 *                 data:
 *                   type: object
 *                   example:
 *                     projectId: "fkfiifi"
 *                     projectTitle: "Solar Energy Installation"
 *       400:
 *         description: Bad request - Invalid input
 *       500:
 *         description: Internal server error
 */
projectRouter.post("/save", addOrUpdateProject); // Handles both create and update

/**
 * @swagger
 * /api/project/projects:
 *   get:
 *     summary: Retrieve all projects
 *     description: Fetches a list of all projects stored in the database.
 *     tags:
 *       - Project
 *     responses:
 *       200:
 *         description: A list of projects
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
 *                   example: "Projects retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProjectView'
 *       500:
 *         description: Internal server error
 */
projectRouter.get("/projects", listProjects);

/**
 * @swagger
 * /api/project/project/{projectId}:
 *   get:
 *     summary: Get a project by ID
 *     description: Retrieve details of a specific project using its project ID.
 *     tags:
 *       - Project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the project
 *     responses:
 *       200:
 *         description: Project retrieved successfully
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
 *                   example: "Project retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ProjectView'
 *       400:
 *         description: Project not found or invalid ID provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Project ID is required"
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "Unexpected database error"
 */
projectRouter.get("/project/:projectId", getProject);

/**
 * @swagger
 * /api/project/project-categories:
 *   get:
 *     summary: Get all project categories
 *     tags:
 *       - Project
 *     responses:
 *       200:
 *         description: List of project categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
projectRouter.get("/project-categories", getProjectCategories);

/**
 * @swagger
 * /api/project/quality-ratings:
 *   get:
 *     summary: Get all project quality ratings
 *     tags:
 *       - Project
 *     responses:
 *       200:
 *         description: List of quality ratings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
projectRouter.get("/quality-ratings", getQualityRatings);

/**
 * @swagger
 * /api/project/status-reports:
 *   get:
 *     summary: Get all project status reports
 *     tags:
 *       - Project
 *     responses:
 *       200:
 *         description: List of status reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
projectRouter.get("/status-reports", getStatusReports);

/**
 * @swagger
 * /api/project/type-of-work:
 *   get:
 *     summary: Get all types of work
 *     tags:
 *       - Project
 *     responses:
 *       200:
 *         description: List of types of work
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
projectRouter.get("/type-of-work", getTypeOfWork);

export default projectRouter;