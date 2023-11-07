const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const puppeteer = require("puppeteer-extra");
const ProxyChain = require("proxy-chain");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { autoScroll } = require("./helpers/autoscroll");
const { scrapjobDetails, jobs } = require("./scripts/job_detals_scrapper");

puppeteer.use(StealthPlugin());
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());

const techs = ["react.js", "node.js", "mern stack"];
const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Côte d'Ivoire",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia (Czech Republic)",
  "Democratic Republic of the Congo (Congo-Kinshasa)",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Holy See",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia (formerly Macedonia)",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

console.log("redis check ====>", process.env.REDIS_DB_NAME);
// Connect to MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@my-cluster.wlkgtiv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log(`app connected with ${process.env.DB_NAME} database 🚀`);
  })
  .catch((err) => {
    console.error("MongoDB connection error: ", err);
  });

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
    console.log("Scraping completed.", jobs.length);

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
    await page.type("#job-search-bar-keywords", tech, { delay: 50 });
    await page.waitForSelector("#job-search-bar-location");
    await page.click("#job-search-bar-location");
    await page.waitForSelector(
      "section.typeahead-input:nth-child(2) > button:nth-child(3) > icon:nth-child(2)"
    );
    await page.waitForTimeout(2000);
    await page.click(
      "section.typeahead-input:nth-child(2) > button:nth-child(3) > icon:nth-child(2)"
    );
    await page.type("#job-search-bar-location", country, { delay: 50 });
    await page.waitForSelector(
      "button.base-search-bar__submit-btn:nth-child(5)"
    );
    await page.click("button.base-search-bar__submit-btn:nth-child(5)");
    await page.waitForTimeout(2000);
    await autoScroll(page);

    const jobElements = await page.$$(".jobs-search__results-list > li");
    console.log(
      `Found ${jobElements.length} job listings for ${tech} in ${country}`
    );

    const linkSelectors = [];

    for (const element of jobElements) {
      await element.click();
      await page.waitForTimeout(1500);
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

  // Recursively move to the next country
  run(techIndex, countryIndex + 1);
};

// Start the recursion from the first technology and the first country
run(0, 0);
