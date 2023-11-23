const express = require("express");
const { getJobs } = require("../controllers/JobController");
const router = express.Router();

router.post("/jobs", getJobs);

module.exports = router;
