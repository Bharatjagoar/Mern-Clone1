const { Router } = require('express');
const controller = require('../controllers/org.controller');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const {
  addMemberSchema,
  updateMemberSchema,
  memberParamSchema,
} = require('../validators/org.validators');

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /organizations/members:
 *   get:
 *     tags: [Organization]
 *     summary: List members of the caller's organization
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Member list }
 *   post:
 *     tags: [Organization]
 *     summary: Add an existing registered user to the organization (org_admin only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *               role: { type: string, enum: [org_admin, member] }
 *     responses:
 *       201: { description: Member added }
 */
router.get('/members', controller.listMembers);
router.post(
  '/members',
  requireRole('org_admin'),
  validate({ body: addMemberSchema }),
  controller.addMember
);

/**
 * @swagger
 * /organizations/members/{userId}:
 *   patch:
 *     tags: [Organization]
 *     summary: Change a member's role (org_admin only)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Updated }
 *   delete:
 *     tags: [Organization]
 *     summary: Remove a member from the organization (org_admin only)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Removed }
 */
router.patch(
  '/members/:userId',
  requireRole('org_admin'),
  validate({ params: memberParamSchema, body: updateMemberSchema }),
  controller.updateMember
);
router.delete(
  '/members/:userId',
  requireRole('org_admin'),
  validate({ params: memberParamSchema }),
  controller.removeMember
);

module.exports = router;
