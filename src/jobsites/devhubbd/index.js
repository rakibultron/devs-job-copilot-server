// const puppeteer = require("puppeteer");

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: true,
//   });
//   const page = await browser.newPage();

//   const url = "https://www.devhubbd.com/companies";
//   await page.goto(url, { waitUntil: "domcontentloaded" });

//   const data = await page.evaluate(() => {
//     const companies = [];

//     const companyElements = document.querySelectorAll(
//       ".mt-4.space-y-6 > .group.rounded-2xl.border.font-geist.dark\\:border-custom-green-500\\/70"
//     );

//     companyElements.forEach((element) => {
//       const companyName = element.querySelector(
//         ".flex.justify-between > div > .textxl.font-bold"
//       )?.innerText;

//       const workModel = element.querySelector(
//         ".mt-2.flex.flex-wrap.items-center.gap-2.text-xs.text-white > p"
//       )?.innerText;

//       const hiresFresher =
//         element.querySelector(
//           ".flex.flex-col > .flex.flex-col.items-center > :nth-child(1)"
//         )?.innerText || "N/A";

//       const hiresIntern =
//         element.querySelector(
//           ".flex.flex-col > .flex.flex-col.items-center > :nth-child(2)"
//         )?.innerText || "N/A";

//       const socialLinks = Array.from(
//         element.querySelectorAll(
//           ".flex.flex-col > .mt-6.flex.items-center.justify-end a"
//         )
//       ).map((link) => link.getAttribute("href") || "N/A");

//       const description =
//         element.querySelector(".mt-6 > p")?.innerText || "N/A";

//       const companyInfo =
//         element.querySelector(".mt-8 > div > div ")?.innerText || "N/A";

//       const establishedYear = companyInfo.match(/\b\d{4}\b/)?.[0] || "N/A";

//       const locationMatch = companyInfo.match(/[A-Za-z\s]+,\s*[A-Za-z\s]+/);

//       // Extract location if found, otherwise default to "N/A"
//       const location = locationMatch ? locationMatch[0].trim() : "N/A";

//       const sizeMatch = companyInfo.match(/\b\d+-\d+\b/);

//       // If found, get the matched value, otherwise set to "N/A"
//       const memberSize = sizeMatch ? sizeMatch[0] : "N/A";

//       const stack = Array.from(
//         element.querySelectorAll(".mt-8 > div > :nth-child(2) > div > p")
//       ).map((stack) => stack.innerText || "N/A");

//       companies.push({
//         companyName,
//         workModel,
//         stack,
//         hiresFresher,
//         hiresIntern,
//         socialLinks,
//         description,
//         establishedYear,
//         location,
//         memberSize,
//       });
//     });

//     return companies;

//   });

//   console.log({ data: data[0] });

//   //   await browser.close();
// })();

const puppeteer = require("puppeteer");

// Function to initialize Puppeteer
async function initializeBrowser() {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--start-maximized",
      //   "--start-fullscreen", // you can also use '--start-fullscreen'
    ],
  });
  const page = await browser.newPage();
  return { browser, page };
}

// Function to navigate to a page and wait until content is loaded
async function goToPage(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
}

// Function to extract data from a single page
async function extractCompanyData(page) {
  return await page.evaluate(() => {
    const companies = [];
    const companyElements = document.querySelectorAll(
      ".mt-4.space-y-6 > .group.rounded-2xl.border.font-geist.dark\\:border-custom-green-500\\/70"
    );

    companyElements.forEach((element) => {
      const companyName =
        element.querySelector(".flex.justify-between > div > .textxl.font-bold")
          ?.innerText || "N/A";

      const workModel =
        element.querySelector(
          ".mt-2.flex.flex-wrap.items-center.gap-2.text-xs.text-white > p"
        )?.innerText || "N/A";

      const hiresFresher =
        element.querySelector(
          ".flex.flex-col > .flex.flex-col.items-center > :nth-child(1)"
        )?.innerText || "N/A";

      const hiresIntern =
        element.querySelector(
          ".flex.flex-col > .flex.flex-col.items-center > :nth-child(2)"
        )?.innerText || "N/A";

      const socialLinks = Array.from(
        element.querySelectorAll(
          ".flex.flex-col > .mt-6.flex.items-center.justify-end a"
        )
      ).map((link) => link.getAttribute("href") || "N/A");

      const description =
        element.querySelector(".mt-6 > p")?.innerText || "N/A";

      const companyInfo =
        element.querySelector(".mt-8 > div > div")?.innerText || "N/A";

      const establishedYear = companyInfo.match(/\b\d{4}\b/)?.[0] || "N/A";
      const locationMatch = companyInfo.match(/[A-Za-z\s]+,\s*[A-Za-z\s]+/);
      const location = locationMatch ? locationMatch[0].trim() : "N/A";

      const sizeMatch = companyInfo.match(/\b\d+-\d+\b/);
      const memberSize = sizeMatch ? sizeMatch[0] : "N/A";

      const stack = Array.from(
        element.querySelectorAll(".mt-8 > div > :nth-child(2) > div > p")
      ).map((stack) => stack.innerText || "N/A");

      companies.push({
        companyName,
        workModel,
        stack,
        hiresFresher,
        hiresIntern,
        socialLinks,
        description,
        establishedYear,
        location,
        memberSize,
      });
    });

    return companies;
  });
}

// Function to handle pagination and scrape data from each page
async function scrapeAllPages(page, baseUrl) {
  await page.setViewport({ width: 1366, height: 768 });
  let currentPage = 1;
  const allData = [];

  while (true) {
    await page.waitForSelector(
      ".mt-4.space-y-6 > .group.rounded-2xl.border.font-geist.dark\\:border-custom-green-500\\/70"
    );
    const nextButton = await page.$('a[rel="next"]');
    console.log(`Scraping page ${currentPage}...`);

    // Extract data from the current page
    const data = await extractCompanyData(page);
    allData.push(...data);

    // Check if there is a next page button, and if so, click it
    await page.$('nav[role="navigation"]');

    if (!nextButton) break; // Exit if no next button is found

    // Go to the next page
    await nextButton.click();
    await page.waitForNavigation({ waitUntil: "domcontentloaded" });
    // await page.waitForTimeout(2000); // Wait for content to load

    currentPage++;
  }

  //   console.log({ allData });
  return allData;
}

// Main function to run the scraper
(async () => {
  const { browser, page } = await initializeBrowser();

  try {
    const url = "https://www.devhubbd.com/companies";
    await goToPage(page, url);

    const companiesData = await scrapeAllPages(page, url);
    // console.log(companiesData);
  } catch (error) {
    console.error("An error occurred while scraping:", error);
  } finally {
    await browser.close();
  }
})();
