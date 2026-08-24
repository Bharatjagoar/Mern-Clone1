const { z } = require('zod');

const createCommentSchema = z.object({
  body: z.string().min(1),
});

module.exports = { createCommentSchema };
