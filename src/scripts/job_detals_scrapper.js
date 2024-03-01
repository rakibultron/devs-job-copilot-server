const { StringToDate } = require("../helpers/date_time");
const extractNumberAndTime = require("../helpers/extractNumberAndTime");
const { extractId } = require("../helpers/uniqe_id_from_link");

const Job = require("../models/JobModel");
const mailQueue = require("../queues/sendMailQueue");

const saveJobInDb = async (jobObj) => {
  //   console.log({ jobObj });
  try {
    const isJobExist = await Job.findOne({ jobId: jobObj.jobId }).exec();

    if (isJobExist) {
      const jobfound = await Job.findOneAndUpdate(
        {
          jobId: jobObj.jobId,
        },
        jobObj
      ).exec();

      console.log("this job already exist on db =======>>>", jobfound);
    } else {
      const job = await new Job(jobObj).save();
      console.log("New job found saved to db =======>>>", job);

      //   mailQueue.add(job, { removeOnComplete: true, removeOnFail: true });
    }
  } catch (error) {
    console.log(error);
  }
};
const scrapjobDetails = async (page, browser) => {
  try {
    // const randomValue = generateRandomNumber();
<<<<<<< HEAD
    // await page.click(page);
    // await page.waitForSelector(".show-more-less-button");
    const showMoreSelector = await page.$(".show-more-less-button");
    if (showMoreSelector) await page.click(".show-more-less-button");
    await page.waitForSelector(".top-card-layout__title");
=======
    await page.waitForTimeout(100);

    // const showMoreSelector = await page.$(".show-more-less-button");
    // if (showMoreSelector) {
    //   await page.click(".show-more-less-button");
    //   console.log("Show more button clcked ====>");
    // }
    await page.waitForSelector(".top-card-layout__title", { timeout: 1000 });
>>>>>>> 1f1fed7b428e86b2942c24ea4c78165a60c7698d

    const jobTitleSelector = await page.$(".top-card-layout__title");
    await page.waitForSelector(".topcard__link", {
      timeout: 3000,
    });

    // const jobLinkSelector = await page.$(".topcard__link");
    // const companySelector = await page.$(".topcard__org-name-link");
    // const locationSelector = await page.$("span.topcard__flavor:nth-child(2)");
    // const postedAtSelector = await page.$(".posted-time-ago__text");

    // const applicatsSelector = await page.$(".num-applicants__caption");
    // const strengthSelector = await page.$(
    //   "li.description__job-criteria-item:nth-child(1) > span:nth-child(2)"
    // );
    // const jobtypeSelector = await page.$(
    //   "li.description__job-criteria-item:nth-child(2) > span:nth-child(2)"
    // );

    // // const extractedHTML = await page.evaluate(async () => {
    // //   const element = document.querySelector(".description__text");
    // //   return element.outerHTML;
    // // });
    const jobTitle = await page.evaluate(async (e) => {
      const element = e.textContent;
      return element;
    }, jobTitleSelector);
    // const jobLink = await page.evaluate(async (e) => {
    //   const element = e.getAttribute("href");
    //   return element;
    // }, jobLinkSelector);
    // const company = await page.evaluate(async (e) => {
    //   const element = e.textContent.trim();
    //   return element;
    // }, companySelector);
    // const companyLink = await page.evaluate(async (e) => {
    //   const element = e.getAttribute("href");
    //   return element;
    // }, companySelector);
    // const location = await page.evaluate(async (e) => {
    //   const element = e.textContent.trim();
    //   return element;
    // }, locationSelector);
    // const postedAt = await page.evaluate(async (e) => {
    //   const element = e.textContent.trim();
    //   return element;
    // }, postedAtSelector);
    // const applicants = await page.evaluate(async (e) => {
    //   const element = e.textContent.trim();
    //   return element;
    // }, applicatsSelector);
    // const strength = await page.evaluate(async (e) => {
    //   const element = e.textContent.trim();
    //   return element;
    // }, strengthSelector);
    // const jobtype = await page.evaluate(async (e) => {
    //   const element = e.textContent.trim();
    //   return element;
    // }, jobtypeSelector);
    // const parts = jobLink.split("?");
    // const modifiedJobUrl = parts[0];
    // const jobId = await extractId(modifiedJobUrl);
    // // console.log("details ===> ", {
    // //   jobTitle,
    // //   company,
    // //   location,
    // //   postedAt,
    // //   applicants,
    // //   strength,
    // //   jobtype,
    // //   companyLink,
    // //   jobLink: modifiedJobUrl,
    // //   jobId,
    // // });
    console.log({ jobTitle });
    // const jobObj = {
    //   jobTitle,
    //   company,
    //   location,
    //   postedAt: extractNumberAndTime(postedAt),
    //   applicants,
    //   strength,
    //   jobtype,
    //   companyLink,
    //   jobLink,
    //   jobId,
    // };

    // console.log("job object ===>", jobObj);

    // saveJobInDb(jobObj);
  } catch (error) {
    console.log(
      "something wrong at job_detals_scrapper ==================>>>>>>",
      error
    );
    // await browser.close();
  }
};

module.exports = { scrapjobDetails };
