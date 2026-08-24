const asyncHandler = require('../utils/asyncHandler');
const orgService = require('../services/org.service');

const listMembers = asyncHandler(async (req, res) => {
  const members = await orgService.listMembers({ orgId: req.auth.orgId });
  res.status(200).json({ data: members });
});

const addMember = asyncHandler(async (req, res) => {
  const member = await orgService.addMember({ orgId: req.auth.orgId, ...req.body });
  res.status(201).json(member);
});

const updateMember = asyncHandler(async (req, res) => {
  const member = await orgService.updateMemberRole({
    orgId: req.auth.orgId,
    userId: req.params.userId,
    role: req.body.role,
  });
  res.status(200).json(member);
});

const removeMember = asyncHandler(async (req, res) => {
  await orgService.removeMember({ orgId: req.auth.orgId, userId: req.params.userId });
  res.status(204).send();
});

module.exports = { listMembers, addMember, updateMember, removeMember };
