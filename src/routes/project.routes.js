const { Router } = require('express');
const controller = require('../controllers/project.controller');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const {
  createProjectSchema,
  updateProjectSchema,
  idParamSchema,
} = require('../validators/project.validators');

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /projects:
 *   get:
 *     tags: [Projects]
 *     summary: List projects in the caller's organization (offset paginated)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paginated project list }
 *   post:
 *     tags: [Projects]
 *     summary: Create a project
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Project created }
 */
router.get('/', controller.list);
router.post('/', validate({ body: createProjectSchema }), controller.create);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Get a project by id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Project }
 *       403: { description: Cross-tenant access denied }
 *       404: { description: Project not found }
 *   patch:
 *     tags: [Projects]
 *     summary: Update a project
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Updated project }
 *   delete:
 *     tags: [Projects]
 *     summary: Soft-delete a project (org_admin only)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Deleted }
 */
router.get('/:id', validate({ params: idParamSchema }), controller.getOne);
router.patch(
  '/:id',
  validate({ params: idParamSchema, body: updateProjectSchema }),
  controller.update
);
router.delete(
  '/:id',
  validate({ params: idParamSchema }),
  requireRole('org_admin'),
  controller.remove
);

/**
 * @swagger
 * /projects/{id}/dashboard:
 *   get:
 *     tags: [Projects]
 *     summary: Task counts grouped by status for a project
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Dashboard counts }
 */
router.get('/:id/dashboard', validate({ params: idParamSchema }), controller.dashboard);

module.exports = router;
