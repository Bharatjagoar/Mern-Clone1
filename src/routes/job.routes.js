const { Router } = require('express');
const { z } = require('zod');
const controller = require('../controllers/job.controller');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

const idParamSchema = z.object({ id: z.string().uuid() });

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     tags: [Jobs]
 *     summary: Get the status of a background notification job
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Job status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string }
 *                 status: { type: string, enum: [pending, active, completed, failed] }
 *                 attempts: { type: integer }
 *                 metadata: { type: object }
 *       404: { description: Job not found }
 */
router.get('/:id', validate({ params: idParamSchema }), controller.getOne);

module.exports = router;
