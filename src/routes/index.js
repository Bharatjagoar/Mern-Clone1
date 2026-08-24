const { Router } = require('express');

const router = Router();

router.use('/auth', require('./auth.routes'));
router.use('/projects', require('./project.routes'));
router.use('/tasks', require('./task.routes'));
router.use('/organizations', require('./org.routes'));
router.use('/jobs', require('./job.routes'));

module.exports = router;
