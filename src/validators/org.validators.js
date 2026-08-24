const { z } = require('zod');

const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['org_admin', 'member']).default('member'),
});

const updateMemberSchema = z.object({
  role: z.enum(['org_admin', 'member']),
});

const memberParamSchema = z.object({
  userId: z.string().uuid(),
});

module.exports = { addMemberSchema, updateMemberSchema, memberParamSchema };
