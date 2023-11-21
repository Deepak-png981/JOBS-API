const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobs');
const authController = require('../controllers/auth');

router.route('/').post(jobsController.createJob).get(jobsController.getAllJobs);

router.route('/:id').get(jobsController.getJob).delete(jobsController.deleteJob).patch(jobsController.updateJob);

module.exports = router;