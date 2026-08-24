const asyncHandler = require('../utils/asyncHandler');
const commentService = require('../services/comment.service');

const list = asyncHandler(async (req, res) => {
  const comments = await commentService.listComments({ orgId: req.auth.orgId, taskId: req.params.id });
  res.status(200).json({ data: comments });
});

const create = asyncHandler(async (req, res) => {
  const comment = await commentService.createComment({
    orgId: req.auth.orgId,
    taskId: req.params.id,
    userId: req.auth.userId,
    body: req.body.body,
  });
  res.status(201).json(comment);
});

module.exports = { list, create };
