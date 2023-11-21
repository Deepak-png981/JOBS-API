const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId });
    res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
}
const getJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;
    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId
    });
    if (!job) {
        throw new NotFoundError(`No job exists with ID : ${jobId}`);
    }
    res.status(StatusCodes.OK).send({ job });
}
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
}
const updateJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;
    // console.log(req.body);
    const { company, position } = req.body;
    if (company === '' || position === '') {
        throw new BadRequestError('Company and Position fields cannot be empty');
    }
    const job = await Job.findByIdAndUpdate({
        _id: jobId,
        createdBy: userId
    }, req.body, { new: true, runValidators: true })
    if (!job) {
        throw new NotFoundError(`No job exists with ID : ${jobId}`);
    }
    res.status(StatusCodes.OK).send({ job });
}
const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;
    // console.log(req.body);

    const job = await Job.findByIdAndRemove({
        _id: jobId,
        createdBy: userId
    })
    if (!job) {
        throw new NotFoundError(`No job exists with ID : ${jobId}`);
    }
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}