const { z } = require('zod');

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

module.exports = { createProjectSchema, updateProjectSchema, idParamSchema };
