const { z } = require('zod');

const TASK_STATUSES = ['todo', 'in_progress', 'review', 'done'];
const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const createTaskSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  dueDate: z.string().datetime().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

const listTasksQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  assignee: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  dueFrom: z.string().datetime().optional(),
  dueTo: z.string().datetime().optional(),
});

const searchQuerySchema = z.object({
  q: z.string().min(1),
  page: z.string().optional(),
  limit: z.string().optional(),
});

const assignTaskSchema = z.object({
  userId: z.string().uuid(),
});

const bulkStatusSchema = z.object({
  taskIds: z.array(z.string().uuid()).min(1),
  status: z.enum(TASK_STATUSES),
});

const taskIdParamSchema = z.object({
  id: z.string().uuid(),
});

const assignmentParamSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
});

module.exports = {
  TASK_STATUSES,
  TASK_PRIORITIES,
  createTaskSchema,
  updateTaskSchema,
  listTasksQuerySchema,
  searchQuerySchema,
  assignTaskSchema,
  bulkStatusSchema,
  taskIdParamSchema,
  assignmentParamSchema,
};
