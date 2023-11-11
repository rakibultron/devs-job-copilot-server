const express = require("express");
const Redis = require("ioredis");
const Bull = require("bull");
const portscanner = require("portscanner");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const puppeteer = require("puppeteer-extra");
const ProxyChain = require("proxy-chain");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { autoScroll } = require("../helpers/autoscroll");
const { scrapjobDetails } = require("../scripts/job_detals_scrapper");

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

  console.log("from process===>", { tech, country });
  // Mark the job as completed
  //   await job.moveToCompleted();

  //   // Remove the job's data upon completion
  //   await job.remove();

  //   console.log("done");

  function generateRandomNumber() {
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

  const randomValue = generateRandomNumber();
  let randomPort = generateRandomPort();
  // Function to check if a port is in use
  async function isPortInUse(port) {
    return new Promise((resolve) => {
      portscanner.checkPortStatus(port, "localhost", (error, status) => {
        resolve(status === "open");
      });
    });
  }
  //   while (await isPortInUse(randomPort)) {
  //     randomPort = generateRandomPort();
  //   }

  // Call the function to generate a random number

  //   const server = new ProxyChain.Server({ port: randomPort });
  //   await server.listen();
  //   if (techIndex >= techs.length) {
  //     console.log("Scraping completed.", jobs.length);

  //     return;
  //   }

  //   if (countryIndex >= countries.length) {
  //     // Move to the next technology when all countries for the current technology are done
  //     run(techIndex + 1, 0);
  //     return;
  //   }

  //   const tech = techs[techIndex];
  //   const country = countries[countryIndex];
  //   const proxyUrl = `http://localhost:${randomValue}`;
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "/tmp/myChromeSession",
    args: [
      "--disable-features=Cookies",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--disable-site-isolation-trials",
      "--start-maximized",
      //   "--incognito",
      //   `--proxy-server=${proxyUrl}`,
      "--disable-extensions",
      "--disable-plugins",
      "--disable-sync",
      "--disable-local-storage",
      "--disable-session-storage",
    ],
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(90000);

  //   await page.setRequestInterception(true);

  //   page.on("request", (request) => {
  //     if (
  //       request.resourceType() === "cookie" ||
  //       request.resourceType() === "setcookie"
  //     ) {
  //       console.log("cookie blocked =========================> :)");
  //       request.abort(); // Block cookie requests
  //     } else {
  //       request.continue();
  //     }
  //   });

  //   await page.goto("chrome://settings/cookies");
  //   await page.evaluate(() =>
  //     document
  //       .querySelector("settings-ui")
  //       .shadowRoot.querySelector("settings-main")
  //       .shadowRoot.querySelector("settings-basic-page")
  //       .shadowRoot.querySelector("settings-section settings-privacy-page")
  //       .shadowRoot.querySelector("settings-cookies-page")
  //       .shadowRoot.querySelector("#blockThirdParty")
  //       .shadowRoot.querySelector("#label")
  //       .click()
  //   );

  try {
    console.log("Opening linkedin.....");
    await page.goto("https://www.linkedin.com");
    await page.waitForSelector(
      "[data-tracking-control-name='guest_homepage-basic_guest_nav_menu_jobs']"
    );
    await page.click(
      "[data-tracking-control-name='guest_homepage-basic_guest_nav_menu_jobs']"
    );
    await page.waitForTimeout(randomValue);
    await page.waitForSelector("#job-search-bar-keywords");
    await page.type("#job-search-bar-keywords", tech, { delay: 25 });
    await page.waitForSelector("#job-search-bar-location");
    await page.click("#job-search-bar-location");
    await page.waitForSelector(
      "section.typeahead-input:nth-child(2) > button:nth-child(3) > icon:nth-child(2)"
    );

    await page.click(
      "section.typeahead-input:nth-child(2) > button:nth-child(3) > icon:nth-child(2)"
    );
    await page.waitForTimeout(randomValue);
    await page.type("#job-search-bar-location", country, { delay: 25 });
    await page.waitForSelector(
      "button.base-search-bar__submit-btn:nth-child(5)"
    );
    await page.click("button.base-search-bar__submit-btn:nth-child(5)");
    await page.waitForTimeout(randomValue);
    await autoScroll(page);

    const jobElements = await page.$$(".jobs-search__results-list > li");
    console.log(
      `Found ${jobElements.length} job listings for ${tech} in ${country}`
    );

    const linkSelectors = [];

    for (const element of jobElements) {
      await element.click();
      await page.waitForTimeout(randomValue);
      await scrapjobDetails(page);
    }

    // Use Promise.all() to evaluate the links and log them
    const links = await Promise.all(
      linkSelectors.map((linkSelector) => {
        return page.evaluate((el) => el.getAttribute("href"), linkSelector);
      })
    );
    //   console.log(links);

    // await scrapjobDetails(page, links, browser);
    await page.waitForTimeout(500);
    await page.close();
    await browser.close();
  } catch (error) {
    await page.close();
    await browser.close();
    console.error(`An error occurred for ${tech} in ${country}:`, error);
  }
});

queue.on("error", function (error) {
  // An error occured.
  console.log("");
});
//
queue.on("waiting", function (jobId) {
  // A Job is waiting to be processed as soon as a worker is idling.
  console.log("");
});

queue.on("active", function (job, jobPromise) {
  // A job has started. You can use `jobPromise.cancel()`` to abort it.
  console.log("");
});

queue.on("stalled", function (job) {
  // A job has been marked as stalled. This is useful for debugging job
  // workers that crash or pause the event loop.
  console.log("");
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
  console.log(" A job failed with reason `err`!=============>", job.data);
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