import express from "express";
import { addOrUpdateProject, getProject, getProjectByTrust, getProjectCategories, getProjectDashboard, getQualityRatings, getStatusReports, getTypeOfWork, listProjects } from "../controllers/projectController";


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
 * /api/project/project-by-trust/{trustId}:
 *   get:
 *     summary: Get a project by Trust ID
 *     description: Retrieve details of a specific project using its trust ID.
 *     tags:
 *       - Project
 *     parameters:
 *       - in: path
 *         name: trustId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the trust
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
 *                   type: array
 *                   $ref: '#/components/schemas/ProjectView'
 *                   
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
projectRouter.get("/project-by-trust/:trustId", getProjectByTrust);

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

/**
 * @swagger
 * /api/project/dashboard/{trustId}/{year}/{state}:
 *   get:
 *     summary: Get project dashboard data
 *     description: |
 *       Returns pie chart data for various metrics (project status, project category, etc.)linked to a specific projectId.  
 *       **Note:** At default a dashboard must preview all data to archive this pass in `ALL` as trustId, then to sort base on project id pass in the trustId e.g `5792b700-c692-46a4-a5c0-129664cf751f` to interact it base on a specific trust.
 *     tags:
 *       - Project
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
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 TOTAL_BUDGET:
 *                   type: array
 *                   items:
 *                     type: object
 *                 TOTAL_ANNUAL_BUDGET:
 *                   type: array
 *                   items:
 *                     type: object
 *                 BENEFITS:
 *                   type: array
 *                   items:
 *                     type: object
 *                 EMPLOYMENT:
 *                   type: array
 *                   items:
 *                     type: object
 *                 CATEGORY:
 *                   type: array
 *                   items:
 *                     type: object
 *                 STATUS_OF_CONFLICT:
 *                   type: array
 *                   items:
 *                     type: object
 *                 STATUS:
 *                   type: array
 *                   items:
 *                     type: object

 *       400:
 *         description: trust Id is required
 *       500:
 *         description: Internal server error
 */
projectRouter.get('/dashboard/:trustId/:year/:state', getProjectDashboard);

export default projectRouter;