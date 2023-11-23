const Job = require("../models/JobModel");
const { parseISO, format } = require("date-fns");
exports.getJobs = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    // console.log("Job body ====>", req.body);
    // console.log("Job query ====>", req.query);
    const parsedStartDate = parseISO(startDate);
    const parseEndDate = parseISO(startDate);

    // Format the parsed date as per your requirement
    const formattedstartDate = format(parsedStartDate, "yyyy-MM-dd");
    const formattedendDate = format(parseEndDate, "yyyy-MM-dd");
    console.log({ formattedstartDate, formattedendDate });

    const jobs = await Job.find({
      postedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    res.json(jobs);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
