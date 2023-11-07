const express = require("express");
const puppeteer = require("puppeteer-extra");
const ProxyChain = require("proxy-chain");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { autoScroll } = require("./helpers/autoscroll");
const { scrapjobDetails } = require("./scripts/job_detals_scrapper");

puppeteer.use(StealthPlugin());
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());

const techs = ["react.js"];
const countries = ["Afghanistan", "Albania", "Algeria"];

const run = async (techIndex, countryIndex) => {
  function generateRandomNumber() {
    // Generate a random number between 0 and 1
    const randomNumber = Math.random();

    // Scale the random number to be between 2000 and 5000
    const min = 2000;
    const max = 4000;
    const scaledNumber = min + randomNumber * (max - min);

    // Round the result to an integer if needed
    const roundedNumber = Math.round(scaledNumber);

    return roundedNumber;
  }

  // Call the function to generate a random number
  const randomValue = generateRandomNumber();
  console.log(randomValue);
  const server = new ProxyChain.Server({ port: randomValue });
  await server.listen();
  if (techIndex >= techs.length) {
    console.log("Scraping completed.");
    return;
  }

  if (countryIndex >= countries.length) {
    // Move to the next technology when all countries for the current technology are done
    run(techIndex + 1, 0);
    return;
  }

  const tech = techs[techIndex];
  const country = countries[countryIndex];
  const proxyUrl = `http://localhost:${randomValue}`;
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "/tmp/myChromeSession",
    args: [
      "--disable-features=Cookies",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--disable-site-isolation-trials",
      "--start-maximized",
      "--incognito",
      `--proxy-server=${proxyUrl}`,
      "--disable-extensions",
      "--disable-plugins",
      "--disable-sync",
      "--disable-local-storage",
      "--disable-session-storage",
    ],
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(90000);

  await page.setRequestInterception(true);

  page.on("request", (request) => {
    if (
      request.resourceType() === "cookie" ||
      request.resourceType() === "setcookie"
    ) {
      console.log("cookie blocked =========================> :)");
      request.abort(); // Block cookie requests
    } else {
      request.continue();
    }
  });

  await page.goto("chrome://settings/cookies");
  await page.evaluate(() =>
    document
      .querySelector("settings-ui")
      .shadowRoot.querySelector("settings-main")
      .shadowRoot.querySelector("settings-basic-page")
      .shadowRoot.querySelector("settings-section settings-privacy-page")
      .shadowRoot.querySelector("settings-cookies-page")
      .shadowRoot.querySelector("#blockThirdParty")
      .shadowRoot.querySelector("#label")
      .click()
  );

  try {
    await page.goto("https://www.linkedin.com");
    await page.waitForSelector(
      "[data-tracking-control-name='guest_homepage-basic_guest_nav_menu_jobs']"
    );
    await page.click(
      "[data-tracking-control-name='guest_homepage-basic_guest_nav_menu_jobs']"
    );
    await page.waitForSelector("#job-search-bar-keywords");
    await page.type("#job-search-bar-keywords", tech, { delay: 100 });
    await page.waitForSelector("#job-search-bar-location");
    await page.click("#job-search-bar-location");
    await page.waitForSelector(
      "section.typeahead-input:nth-child(2) > button:nth-child(3) > icon:nth-child(2)"
    );
    await page.waitForTimeout(2000);
    await page.click(
      "section.typeahead-input:nth-child(2) > button:nth-child(3) > icon:nth-child(2)"
    );
    await page.type("#job-search-bar-location", country, { delay: 100 });
    await page.waitForSelector(
      "button.base-search-bar__submit-btn:nth-child(5)"
    );
    await page.click("button.base-search-bar__submit-btn:nth-child(5)");
    await page.waitForTimeout(3000);
    await autoScroll(page);

    const jobElements = await page.$$(".jobs-search__results-list > li");
    console.log(
      `Found ${jobElements.length} job listings for ${tech} in ${country}`
    );

    const linkSelectors = [];

    for (const element of jobElements) {
      await element.click();
      await page.waitForTimeout(3000);
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
    await page.waitForTimeout(2000);
    await page.close();
    await browser.close();
  } catch (error) {
    await page.close();
    await browser.close();
    console.error(`An error occurred for ${tech} in ${country}:`, error);
  }

  // Recursively move to the next country
  run(techIndex, countryIndex + 1);
};

// Start the recursion from the first technology and the first country
run(0, 0);
