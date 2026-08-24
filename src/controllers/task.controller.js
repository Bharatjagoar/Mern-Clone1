const asyncHandler = require('../utils/asyncHandler');
const taskService = require('../services/task.service');
const assignmentService = require('../services/assignment.service');

const list = asyncHandler(async (req, res) => {
  const result = await taskService.listTasks({ orgId: req.auth.orgId, query: req.query });
  res.status(200).json(result);
});

const search = asyncHandler(async (req, res) => {
  const result = await taskService.searchTasks({
    orgId: req.auth.orgId,
    q: req.query.q,
    query: req.query,
  });
  res.status(200).json(result);
});

const getOne = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskOrThrow({ orgId: req.auth.orgId, id: req.params.id });
  res.status(200).json(task);
});

const create = asyncHandler(async (req, res) => {
  const task = await taskService.createTask({ orgId: req.auth.orgId, data: req.body });
  res.status(201).json(task);
});

const update = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask({
    orgId: req.auth.orgId,
    id: req.params.id,
    data: req.body,
  });
  res.status(200).json(task);
});

const remove = asyncHandler(async (req, res) => {
  await taskService.deleteTask({ orgId: req.auth.orgId, id: req.params.id });
  res.status(204).send();
});

const bulkUpdateStatus = asyncHandler(async (req, res) => {
  const result = await taskService.bulkUpdateStatus({
    orgId: req.auth.orgId,
    taskIds: req.body.taskIds,
    status: req.body.status,
  });
  res.status(200).json(result);
});

const assign = asyncHandler(async (req, res) => {
  const result = await assignmentService.assignUser({
    orgId: req.auth.orgId,
    taskId: req.params.id,
    userId: req.body.userId,
    actorId: req.auth.userId,
  });
  res.status(201).json(result);
});

const unassign = asyncHandler(async (req, res) => {
  await assignmentService.unassignUser({
    orgId: req.auth.orgId,
    taskId: req.params.id,
    userId: req.params.userId,
  });
  res.status(204).send();
});

module.exports = { list, search, getOne, create, update, remove, bulkUpdateStatus, assign, unassign };
