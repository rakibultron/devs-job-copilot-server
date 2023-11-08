const { extractId } = require("../helpers/uniqe_id_from_link");
const Job = require("../models/JobModel");
let jobs = [];

const saveJobInDb = async () => {
  try {
    jobs.forEach(async (item) => {
      const isJobExist = await Job.findOne({ jobId: item.jobId }).exec();

      if (isJobExist) {
        const jobfound = await Job.findOneAndUpdate(
          {
            jobId: item.jobId,
          },
          item
        ).exec();

        console.log("this job already exist on db ===== >", jobfound);
      } else {
        const job = await new Job(item).save();
        console.log(job);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
const scrapjobDetails = async (page) => {
  try {
    const randomValue = generateRandomNumber();
    // await page.click(page);
    await page.waitForSelector(".show-more-less-button");
    const showMoreSelector = await page.$(".show-more-less-button");
    if (showMoreSelector) await page.click(".show-more-less-button");
    await page.waitForSelector(".top-card-layout__title");

    const jobTitleSelector = await page.$(".top-card-layout__title");
    const jobLinkSelector = await page.$(".topcard__link");
    const companySelector = await page.$(".topcard__org-name-link");
    const locationSelector = await page.$("span.topcard__flavor:nth-child(2)");
    const postedAtSelector = await page.$(".posted-time-ago__text");
    const applicatsSelector = await page.$(".num-applicants__caption");
    const strengthSelector = await page.$(
      "li.description__job-criteria-item:nth-child(1) > span:nth-child(2)"
    );
    const jobtypeSelector = await page.$(
      "li.description__job-criteria-item:nth-child(2) > span:nth-child(2)"
    );

    const extractedHTML = await page.evaluate(async () => {
      const element = document.querySelector(".description__text");
      return element.outerHTML;
    });
    const jobTitle = await page.evaluate(async (e) => {
      const element = e.textContent;
      return element;
    }, jobTitleSelector);
    const jobLink = await page.evaluate(async (e) => {
      const element = e.getAttribute("href");
      return element;
    }, jobLinkSelector);
    const company = await page.evaluate(async (e) => {
      const element = e.textContent.trim();
      return element;
    }, companySelector);
    const companyLink = await page.evaluate(async (e) => {
      const element = e.getAttribute("href");
      return element;
    }, companySelector);
    const location = await page.evaluate(async (e) => {
      const element = e.textContent.trim();
      return element;
    }, locationSelector);
    const postedAt = await page.evaluate(async (e) => {
      const element = e.textContent.trim();
      return element;
    }, postedAtSelector);
    const applicants = await page.evaluate(async (e) => {
      const element = e.textContent.trim();
      return element;
    }, applicatsSelector);
    const strength = await page.evaluate(async (e) => {
      const element = e.textContent.trim();
      return element;
    }, strengthSelector);
    const jobtype = await page.evaluate(async (e) => {
      const element = e.textContent.trim();
      return element;
    }, jobtypeSelector);
    const parts = jobLink.split("?");
    const modifiedJobUrl = parts[0];
    const jobId = await extractId(modifiedJobUrl);
    // console.log("details ===> ", {
    //   jobTitle,
    //   company,
    //   location,
    //   postedAt,
    //   applicants,
    //   strength,
    //   jobtype,
    //   companyLink,
    //   jobLink: modifiedJobUrl,
    //   jobId,
    // });
    function generateRandomNumber() {
      // Generate a random number between 0 and 1
      const randomNumber = Math.random();

      // Scale the random number to be between 2000 and 5000
      const min = 1000;
      const max = 4000;
      const scaledNumber = min + randomNumber * (max - min);

      // Round the result to an integer if needed
      const roundedNumber = Math.round(scaledNumber);

      return roundedNumber;
    }
    const jobObj = {
      jobTitle,
      company,
      location,
      postedAt,
      applicants,
      strength,
      jobtype,
      companyLink,
      jobLink: modifiedJobUrl,
      jobId,
    };

    // console.log("job object ===>", jobObj);
    jobs.push(jobObj);
    saveJobInDb();
    // jobs = [];
  } catch (error) {
    console.log("something wrong ==================>>>>>>", error);
  }
};

module.exports = { scrapjobDetails, jobs };
