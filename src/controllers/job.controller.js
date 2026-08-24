const asyncHandler = require('../utils/asyncHandler');
const jobService = require('../services/job.service');

const getOne = asyncHandler(async (req, res) => {
  const job = await jobService.getJob({ id: req.params.id });
  res.status(200).json(job);
});

module.exports = { getOne };
