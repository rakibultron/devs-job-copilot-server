const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");
const Schema = mongoose.Schema;

const JobSchema = Schema(
  {
    jobTitle: mongoose.Schema.Types.String,
    company: mongoose.Schema.Types.String,
    location: mongoose.Schema.Types.String,
    postedAt: mongoose.Schema.Types.Date,
    applicants: mongoose.Schema.Types.String,
    strength: mongoose.Schema.Types.String,
    jobtype: mongoose.Schema.Types.String,
    companyLink: mongoose.Schema.Types.String,
    jobLink: mongoose.Schema.Types.String,
    jobId: mongoose.Schema.Types.String,
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
