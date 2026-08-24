const asyncHandler = require('../utils/asyncHandler');
const projectService = require('../services/project.service');

const list = asyncHandler(async (req, res) => {
  const result = await projectService.listProjects({ orgId: req.auth.orgId, query: req.query });
  res.status(200).json(result);
});

const getOne = asyncHandler(async (req, res) => {
  const project = await projectService.getProject({ orgId: req.auth.orgId, id: req.params.id });
  res.status(200).json(project);
});

const create = asyncHandler(async (req, res) => {
  const project = await projectService.createProject({ orgId: req.auth.orgId, data: req.body });
  res.status(201).json(project);
});

const update = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject({
    orgId: req.auth.orgId,
    id: req.params.id,
    data: req.body,
  });
  res.status(200).json(project);
});

const remove = asyncHandler(async (req, res) => {
  await projectService.deleteProject({ orgId: req.auth.orgId, id: req.params.id });
  res.status(204).send();
});

const dashboard = asyncHandler(async (req, res) => {
  const result = await projectService.getDashboard({ orgId: req.auth.orgId, id: req.params.id });
  res.status(200).json(result);
});

module.exports = { list, getOne, create, update, remove, dashboard };
