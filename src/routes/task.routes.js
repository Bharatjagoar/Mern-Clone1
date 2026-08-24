const { Router } = require('express');
const controller = require('../controllers/task.controller');
const commentController = require('../controllers/comment.controller');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  createTaskSchema,
  updateTaskSchema,
  listTasksQuerySchema,
  searchQuerySchema,
  assignTaskSchema,
  bulkStatusSchema,
  taskIdParamSchema,
  assignmentParamSchema,
} = require('../validators/task.validators');
const { createCommentSchema } = require('../validators/comment.validators');

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks in the caller's organization, with filters and offset pagination
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [todo, in_progress, review, done] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [low, medium, high, urgent] }
 *       - in: query
 *         name: assignee
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: projectId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: dueFrom
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: dueTo
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paginated task list }
 *   post:
 *     tags: [Tasks]
 *     summary: Create a task
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectId, title]
 *             properties:
 *               projectId: { type: string, format: uuid }
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [todo, in_progress, review, done] }
 *               priority: { type: string, enum: [low, medium, high, urgent] }
 *               dueDate: { type: string, format: date-time }
 *     responses:
 *       201: { description: Task created }
 */
router.get('/', validate({ query: listTasksQuerySchema }), controller.list);
router.post('/', validate({ body: createTaskSchema }), controller.create);

/**
 * @swagger
 * /tasks/search:
 *   get:
 *     tags: [Tasks]
 *     summary: Full-text search over task title + description (Postgres tsvector)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Paginated search results }
 */
router.get('/search', validate({ query: searchQuerySchema }), controller.search);

/**
 * @swagger
 * /tasks/bulk-status:
 *   patch:
 *     tags: [Tasks]
 *     summary: Update status for multiple tasks at once
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [taskIds, status]
 *             properties:
 *               taskIds:
 *                 type: array
 *                 items: { type: string, format: uuid }
 *               status: { type: string, enum: [todo, in_progress, review, done] }
 *     responses:
 *       200: { description: Number of tasks updated }
 */
router.patch('/bulk-status', validate({ body: bulkStatusSchema }), controller.bulkUpdateStatus);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get a task by id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Task }
 *       403: { description: Cross-tenant access denied }
 *       404: { description: Task not found }
 *   patch:
 *     tags: [Tasks]
 *     summary: Update a task
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Updated task }
 *   delete:
 *     tags: [Tasks]
 *     summary: Soft-delete a task
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Deleted }
 */
router.get('/:id', validate({ params: taskIdParamSchema }), controller.getOne);
router.patch(
  '/:id',
  validate({ params: taskIdParamSchema, body: updateTaskSchema }),
  controller.update
);
router.delete('/:id', validate({ params: taskIdParamSchema }), controller.remove);

/**
 * @swagger
 * /tasks/{id}/assignments:
 *   post:
 *     tags: [Tasks]
 *     summary: Assign a user (must be in the same org) to a task — enqueues an email notification job
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId: { type: string, format: uuid }
 *     responses:
 *       201: { description: Assignment created, notification job enqueued }
 *       400: { description: Assignee not in the same organization }
 *       409: { description: Already assigned }
 */
router.post(
  '/:id/assignments',
  validate({ params: taskIdParamSchema, body: assignTaskSchema }),
  controller.assign
);

/**
 * @swagger
 * /tasks/{id}/assignments/{userId}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Unassign a user from a task
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Unassigned }
 *       404: { description: Assignment not found }
 */
router.delete(
  '/:id/assignments/:userId',
  validate({ params: assignmentParamSchema }),
  controller.unassign
);

/**
 * @swagger
 * /tasks/{id}/comments:
 *   get:
 *     tags: [Tasks]
 *     summary: List comments on a task
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Comment list }
 *   post:
 *     tags: [Tasks]
 *     summary: Add a comment to a task
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [body]
 *             properties:
 *               body: { type: string }
 *     responses:
 *       201: { description: Comment created }
 */
router.get('/:id/comments', validate({ params: taskIdParamSchema }), commentController.list);
router.post(
  '/:id/comments',
  validate({ params: taskIdParamSchema, body: createCommentSchema }),
  commentController.create
);

module.exports = router;
