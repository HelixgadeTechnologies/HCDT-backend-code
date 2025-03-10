import { Router } from "express";
import { createOrUpdateEconomicImpact, economicImpactByTrustId, getAllImpactOptionOne, getAllImpactOptionTwo, getEconomicImpact, listEconomicImpacts } from "../controllers/economicImpactController";

const economicImpactRouter = Router();

/**
 * @swagger
 * /api/economic-impact/create:
 *   post:
 *     summary: Create or Update an Economic Impact record
 *     description: If `isCreate` is `true`, it creates a new economicImpact; otherwise, it updates an existing economicImpact.
 *       **Note:** `economicImpactId` can be ignored if `isCreate` is true but is required when `isCreate` is false.
 *     tags: [Economic Impact]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 description: Determines whether to create (true) or update (false) the record.
 *               data:
 *                 type: object
 *                 properties:
 *                   economicImpactId:
 *                     type: string
 *                     format: uuid
 *                     description: Required only when updating.
 *                   businessGrowth:
 *                     type: integer
 *                     nullable: true
 *                   incomeIncrease:
 *                     type: integer
 *                     nullable: true
 *                   livelihoodImprove:
 *                     type: integer
 *                     nullable: true
 *                   accessAmenities:
 *                     type: integer
 *                     nullable: true
 *                   trustId:
 *                     type: string
 *                     nullable: true
 *     responses:
 *       200:
 *         description: Economic Impact record successfully created or updated.
 *       400:
 *         description: Bad request, missing or invalid parameters.
 *       500:
 *         description: Internal server error.
 */
economicImpactRouter.post("/create", createOrUpdateEconomicImpact);

/**
 * @swagger
 * /api/economic-impact/economicImpacts:
 *   get:
 *     summary: Get all Economic Impact records
 *     tags: [Economic Impact]
 *     responses:
 *       200:
 *         description: A list of all economic impact records from the view.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   economicImpactId:
 *                     type: string
 *                     format: uuid
 *                   businessGrowth:
 *                     type: integer
 *                     nullable: true
 *                   incomeIncrease:
 *                     type: integer
 *                     nullable: true
 *                   livelihoodImprove:
 *                     type: integer
 *                     nullable: true
 *                   businessGrowthStatus:
 *                     type: string
 *                     nullable: true
 *                   incomeIncreaseStatus:
 *                     type: string
 *                     nullable: true
 *                   livelihoodImproveStatus:
 *                     type: string
 *                     nullable: true
 *                   accessAmenities:
 *                     type: integer
 *                     nullable: true
 *                   accessAmenitiesStatus:
 *                     type: string
 *                     nullable: true
 *                   trustId:
 *                     type: string
 *                     nullable: true
 *                   trustName:
 *                     type: string
 *                     nullable: true
 *       404:
 *         description: No economic impact data found.
 *       500:
 *         description: Internal server error.
 */
economicImpactRouter.get("/economicImpacts", listEconomicImpacts);

/**
 * @swagger
 * /api/economic-impact/economicImpact/{economicImpactId}:
 *   get:
 *     summary: Get Economic Impact by ID
 *     tags: [Economic Impact]
 *     parameters:
 *       - in: path
 *         name: economicImpactId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the Economic Impact record to retrieve
 *     responses:
 *       200:
 *         description: Economic Impact record found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 economicImpactId:
 *                   type: string
 *                   format: uuid
 *                 businessGrowth:
 *                   type: integer
 *                   nullable: true
 *                 incomeIncrease:
 *                   type: integer
 *                   nullable: true
 *                 livelihoodImprove:
 *                   type: integer
 *                   nullable: true
 *                 businessGrowthStatus:
 *                   type: string
 *                   nullable: true
 *                 incomeIncreaseStatus:
 *                   type: string
 *                   nullable: true
 *                 livelihoodImproveStatus:
 *                   type: string
 *                   nullable: true
 *                 accessAmenities:
 *                   type: integer
 *                   nullable: true
 *                 accessAmenitiesStatus:
 *                   type: string
 *                   nullable: true
 *                 trustId:
 *                   type: string
 *                   nullable: true
 *                 trustName:
 *                   type: string
 *                   nullable: true
 *       404:
 *         description: Economic Impact record not found.
 *       500:
 *         description: Internal server error.
 */
economicImpactRouter.get("/economicImpact/:economicImpactId", getEconomicImpact);

/**
 * @swagger
 * /api/economic-impact/economicImpact_by_trust/{trustId}:
 *   get:
 *     summary: Get Economic Impact by Trust ID
 *     tags: [Economic Impact]
 *     parameters:
 *       - in: path
 *         name: trustId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The Trust ID of the Economic Impact record to retrieve
 *     responses:
 *       200:
 *         description: Economic Impact record found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 economicImpactId:
 *                   type: string
 *                   format: uuid
 *                 businessGrowth:
 *                   type: integer
 *                   nullable: true
 *                 incomeIncrease:
 *                   type: integer
 *                   nullable: true
 *                 livelihoodImprove:
 *                   type: integer
 *                   nullable: true
 *                 businessGrowthStatus:
 *                   type: string
 *                   nullable: true
 *                 incomeIncreaseStatus:
 *                   type: string
 *                   nullable: true
 *                 livelihoodImproveStatus:
 *                   type: string
 *                   nullable: true
 *                 accessAmenities:
 *                   type: integer
 *                   nullable: true
 *                 accessAmenitiesStatus:
 *                   type: string
 *                   nullable: true
 *                 trustId:
 *                   type: string
 *                   nullable: true
 *                 trustName:
 *                   type: string
 *                   nullable: true
 *       404:
 *         description: Economic Impact record not found.
 *       500:
 *         description: Internal server error.
 */
economicImpactRouter.get("/economicImpact_by_trust/:trustId", economicImpactByTrustId);


/**
 * @swagger
 * /api/economic-impact/impactOptionOne:
 *   get:
 *     summary: Get all ImpactOptionOne
 *     tags: [Economic Impact]
 *     responses:
 *       200:
 *         description: List of impactOptionOne
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
economicImpactRouter.get("/impactOptionOne", getAllImpactOptionOne);
/**
 * @swagger
 * /api/economic-impact/impactOptionTwo:
 *   get:
 *     summary: Get all impactOptionTwo
 *     tags: [Economic Impact]
 *     responses:
 *       200:
 *         description: List of impactOptionTwo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
economicImpactRouter.get("/impactOptionTwo", getAllImpactOptionTwo);
export default economicImpactRouter;