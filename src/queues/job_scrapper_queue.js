const express = require("express");
const Redis = require("ioredis");
const Bull = require("bull");
const portscanner = require("portscanner");
const randomUserAgent = require("random-useragent");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const puppeteer = require("puppeteer-extra");
const ProxyChain = require("proxy-chain");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { autoScroll } = require("../helpers/autoscroll");
const { scrapjobDetails } = require("../scripts/job_detals_scrapper");
// const { el } = require("date-fns/esm/locale");

puppeteer.use(StealthPlugin());
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());

const redisOptions = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USER_NAME,
  password: process.env.REDIS_PASSWORD,
};

const redis = new Redis(redisOptions);
// Check the connection status
redis.on("connect", () => {
  console.log("Connected to Redis database.");
});

// Check for errors during connection
redis.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});

// Create an instance of the Bull queue
const queue = new Bull("scraper-queue", {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
});

queue.process(async (job) => {
  const { tech, country } = await job.data;

  async function generateRandomNumber() {
    // Generate a random number between 0 and 1
    const randomNumber = Math.random();

    // Scale the random number to be between 2000 and 5000
    const min = 1000;
    const max = 3000;
    const scaledNumber = min + randomNumber * (max - min);

    // Round the result to an integer if needed
    const roundedNumber = Math.round(scaledNumber);

    return roundedNumber;
  }
  function generateRandomPort() {
    // Generate a random number between 0 and 1
    const randomNumber = Math.random();

    // Scale the random number to be between 2000 and 5000
    const min = 5000;
    const max = 6000;
    const scaledNumber = min + randomNumber * (max - min);

    // Round the result to an integer if needed
    const roundedNumber = Math.round(scaledNumber);

    return roundedNumber;
  }

  const randomValue = await generateRandomNumber();

  const browser = await puppeteer.launch({
    headless: "new",

    // userDataDir: "/tmp/myChromeSession",
    args: [
      //   "--disable-features=Cookies",
      //   "--disable-web-security",
      //   "--disable-features=IsolateOrigins,site-per-process",
      //   "--disable-site-isolation-trials",
      //   "--start-maximized",
      //   "--incognito",
      //   //   `--proxy-server=${proxyUrl}`,
      //   "--disable-extensions",
      //   "--disable-plugins",
      //   "--disable-sync",
      //   "--disable-local-storage",
      //   "--disable-session-storage",
    ],
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(9000);

  try {
    console.log("Opening linkedin.....");
    // await page.setUserAgent(
    //   randomUserAgent.getRandom(function (ua) {
    //     return ua.browserName === "Chrome";
    //   })
    // );
    await page.goto("https://www.linkedin.com", { waitUntil: "networkidle2" });

    await page.waitForSelector(
      "[data-tracking-control-name='guest_homepage-basic_guest_nav_menu_jobs']"
    );
    await page.click(
      "[data-tracking-control-name='guest_homepage-basic_guest_nav_menu_jobs']"
    );
    await page.waitForTimeout(randomValue);
    await page.waitForSelector("#job-search-bar-keywords", { timeout: 5000 });
    await page.type("#job-search-bar-keywords", tech, { delay: 100 });
    await page.waitForSelector("#job-search-bar-location");
    await page.click("#job-search-bar-location");
    await page.waitForSelector(
      "section.typeahead-input:nth-child(2) > button:nth-child(3) > icon:nth-child(2)"
    );

    await page.click(
      "section.typeahead-input:nth-child(2) > button:nth-child(3) > icon:nth-child(2)"
    );
    await page.waitForTimeout(randomValue);
    await page.type("#job-search-bar-location", country, { delay: 200 });
    await page.waitForSelector(
      "button.base-search-bar__submit-btn:nth-child(5)"
    );
    await page.click("button.base-search-bar__submit-btn:nth-child(5)");
    await page.waitForTimeout(2000);

    // Example usage:
    console.log("Start");

    await autoScroll(page);
    await page.waitForTimeout(2000);
    const jobElements = await page.$$(".jobs-search__results-list > li");
    console.log(
      `Found ${jobElements.length} job listings for ${tech} in ${country}`
    );

    for (const element of jobElements) {
      try {
        //   console.log({ element });
        //   await page.waitForTimeout(2000);
        // await element.evaluate((element) => element.click(), element);
        element.click();
        await page.waitForTimeout(2000);

        let isShowButton = await page.evaluate(() => {
          let el = document.querySelector(".show-more-less-button");
          return el ? el : false;
        });
        if (isShowButton) {
          await page.waitForSelector(".show-more-less-button", {
            timeout: 5000,
          });
          //   await page.waitForTimeout(randomValue);
          //   await page.waitForSelector(".top-card-layout__title");
          await scrapjobDetails(page);
        } else {
          console.log("There is no showmore button.");
        }
      } catch (error) {
        console.log(error);
      }
    }
    // for (const element of jobElements) {
    //   //   try {
    //   //     await page.waitForTimeout(500);
    //   //     // await page.evaluate((el) => el.click(), element);

    //   //     await page.waitForTimeout(2000);

    //   //     await Promise.all([page.waitForNavigation(), element.click()]);
    //   //     const showmoreBtn = await page.$(".show-more-less-button");
    //   //     if (showmoreBtn) await page.click(".show-more-less-button");
    //   //     scrapjobDetails(page, browser);
    //   //   } catch (error) {
    //   //     console.log(error);
    //   //   }

    //   //   try {
    //   //     await page.waitForTimeout(2000);
    //   //     // Check if the element is clickable
    //   //     const isClickable = await element.isIntersectingViewport();
    //   //     if (isClickable) {
    //   //       //   await Promise.all([page.waitForNavigation(), element.click()]);
    //   //       await Promise.all([
    //   //         // page.waitForNavigation(),
    //   //         page.evaluate((el) => el.click(), element),
    //   //       ]);
    //   //       const showmoreBtn = await page.$(".show-more-less-button");
    //   //       if (showmoreBtn) await page.click(".show-more-less-button");
    //   //       await scrapjobDetails(page, browser);
    //   //     } else {
    //   //       console.log("Element is not clickable.");
    //   //     }
    //   //   } catch (error) {
    //   //     console.log(error);
    //   //   }
    //   try {
    //     await page.waitForTimeout(500);

    //     //   #main-content > section > ul > li:nth-child(1) > div
    //     // Check if the element is still in the DOM
    //     const isElementPresent = await page.evaluate(
    //       (el) => document.body.contains(el),
    //       element
    //     );

    //     if (isElementPresent) {
    //       //   #main-content > section > ul > li:nth-child(1) > div > a
    //       // Check if the element is clickable
    //       //   const isClickable = await element.isIntersectingViewport();
    //       //   await Promise.all([page.waitForNavigation(), element.click()]);
    //       //   const showmoreBtn = await page.$(".show-more-less-button");
    //       //   if (showmoreBtn) await page.click(".show-more-less-button");
    //       //   await element.evaluate((element) => element.click(), element);
    //       //   const jobLinkSelector = await page.$(".topcard__link");
    //       //   const jobLink = await page.evaluate(async (e) => {
    //       //     const link = e.getAttribute("href");
    //       //     return link;
    //       //   }, element);
    //       const anchorElement = await element.$("a");
    //       const hrefHandle = await anchorElement.getProperty("href");
    //       const hrefValue = await hrefHandle.jsonValue();
    //       //   console.log({ hrefValue });

    //       const jobpage = await browser.newPage();
    //       await page.waitForTimeout(1000);
    //       await jobpage.goto(hrefValue, { waitUntil: "networkidle2" });

    //       //   console.log({ jobLink });
    //       //   await page.waitForTimeout(3000);
    //       await scrapjobDetails(jobpage, browser);
    //       await jobpage.close();
    //       //   if (isClickable) {
    //       //     await Promise.all([page.waitForNavigation(), element.click()]);
    //       //     const showmoreBtn = await page.$(".show-more-less-button");
    //       //     if (showmoreBtn) await page.click(".show-more-less-button");
    //       //     await scrapjobDetails(page, browser);
    //       //   } else {
    //       //     console.log("Element is not clickable.");
    //       //   }
    //     } else {
    //       console.log("Element is not present in the DOM.");
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    // await scrapjobDetails(page, links, browser);
    await page.waitForTimeout(2000);
    await page.close();
    await browser.close();
  } catch (error) {
    await page.close();
    await browser.close();
    console.error(`An error occurred for ${tech} in ${country}:`, error);
  }
});

queue.on("error", function (error) {
  console.log(" An error occured.", error);
});

queue.on("waiting", function (jobId) {
  //   console.log(
  //     " // A Job is waiting to be processed as soon as a worker is idling. ==========>",
  //     jobId
  //   );
});

queue.on("active", function (job, jobPromise) {
  // A job has started. You can use `jobPromise.cancel()`` to abort it
  console.log("A job has started.========>>>>", job.data);
});

queue.on("stalled", function (job) {
  // workers that crash or pause the event loop.
  console.log(
    " // A job has been marked as stalled. This is useful for debugging job",
    job.data
  );
});

queue.on("lock-extension-failed", function (job, err) {
  // A job failed to extend lock. This will be useful to debug redis
  // connection issues and jobs getting restarted because workers
  // are not able to extend locks.
  console.log("");
});

queue.on("progress", function (job, progress) {
  //
  console.log("A job's progress was updated! ==> ", job.data);
});

queue.on("completed", function (job, result) {
  console.log(
    " A job successfully completed with a `result`.=============>",
    job.data
  );
  //   await queue.obliterate();
});

queue.on("failed", function (job, err) {
  console.log(" A job failed with reason `err`!=============>", err, job.data);
});

queue.on("paused", function () {
  // The queue has been paused.
});

queue.on("resumed", function (job) {
  // The queue has been resumed.
});

queue.on("cleaned", function (jobs, type) {
  console.log(
    " Old jobs have been cleaned from the queue. `jobs` is an array of cleaned =============>"
  );
});

queue.on("drained", function () {
  // Emitted every time the queue has processed all the waiting jobs (even if there can be some delayed jobs not yet processed)
});

queue.on("removed", function (job) {
  // A job successfully removed.
});

module.exports = queue;
