exports.scrapjobDetails = async (page) => {
  //   for (const link of links) {
  //     try {
  //       const randomValue = generateRandomNumber();
  //       console.log(randomValue);
  //       const context = await browser.createIncognitoBrowserContext();
  //       const page = await browser.newPage();

  //       const parts = link.split("?");
  //       const modifiedUrl = parts[0];
  //       await page.goto(link, { waitUntil: "domcontentloaded" });
  //       await page.setUserAgent(
  //         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
  //       );

  //       // Enable the DevTools Protocol
  //       const client = await page.target().createCDPSession();

  //       await page.waitForSelector(".show-more-less-button");

  //       await page.click(".show-more-less-button");
  //       await page.waitForSelector(".top-card-layout__title");
  //       const jobTitleSelector = await page.$(".top-card-layout__title");
  //       const companySelector = await page.$(".topcard__org-name-link");
  //       const locationSelector = await page.$(
  //         "span.topcard__flavor:nth-child(2)"
  //       );
  //       const postedAtSelector = await page.$(".posted-time-ago__text");
  //       const applicatsSelector = await page.$(".num-applicants__caption");
  //       const strengthSelector = await page.$(
  //         "li.description__job-criteria-item:nth-child(1) > span:nth-child(2)"
  //       );
  //       const jobtypeSelector = await page.$(
  //         "li.description__job-criteria-item:nth-child(2) > span:nth-child(2)"
  //       );

  //       const extractedHTML = await page.evaluate(async () => {
  //         const element = document.querySelector(".description__text");
  //         return element.outerHTML;
  //       });
  //       const jobTitle = await page.evaluate(async (e) => {
  //         const element = e.textContent;
  //         return element;
  //       }, jobTitleSelector);
  //       const company = await page.evaluate(async (e) => {
  //         const element = e.textContent.trim();
  //         return element;
  //       }, companySelector);
  //       const companyLink = await page.evaluate(async (e) => {
  //         const element = e.getAttribute("href");
  //         return element;
  //       }, companySelector);
  //       const location = await page.evaluate(async (e) => {
  //         const element = e.textContent.trim();
  //         return element;
  //       }, locationSelector);
  //       const postedAt = await page.evaluate(async (e) => {
  //         const element = e.textContent.trim();
  //         return element;
  //       }, postedAtSelector);
  //       const applicants = await page.evaluate(async (e) => {
  //         const element = e.textContent.trim();
  //         return element;
  //       }, applicatsSelector);
  //       const strength = await page.evaluate(async (e) => {
  //         const element = e.textContent.trim();
  //         return element;
  //       }, strengthSelector);
  //       const jobtype = await page.evaluate(async (e) => {
  //         const element = e.textContent.trim();
  //         return element;
  //       }, jobtypeSelector);

  //       console.log("details ===> ", {
  //         jobTitle,
  //         company,
  //         location,
  //         postedAt,
  //         applicants,
  //         strength,
  //         jobtype,
  //         companyLink,
  //         jobLink: link,
  //       });
  //       function generateRandomNumber() {
  //         // Generate a random number between 0 and 1
  //         const randomNumber = Math.random();

  //         // Scale the random number to be between 2000 and 5000
  //         const min = 1000;
  //         const max = 4000;
  //         const scaledNumber = min + randomNumber * (max - min);

  //         // Round the result to an integer if needed
  //         const roundedNumber = Math.round(scaledNumber);

  //         return roundedNumber;
  //       }

  //       const cookies = await page.cookies();

  //       for (const cookie of cookies) {
  //         //   console.log({ name: cookie.name });
  //         // await page.deleteCookie({
  //         //   name: cookie.name,
  //         //   domain: cookie.domain,
  //         // });
  //         await page.deleteCookie({ name: cookie.name, domain: cookie.domain });
  //       }
  //       //   await page.waitForTimeout(
  //       //     500000000000000000000000000000000000000000000000
  //       //   );

  //       await page.setCacheEnabled(false);
  //       await page.evaluate(() => {
  //         // Clear cookies
  //         document.cookie = "";

  //         // Clear local storage
  //         localStorage.clear();

  //         // Clear indexedDB
  //         // indexedDB.deleteDatabase("yourIndexedDBName");

  //         // Clear cache
  //         if (caches) {
  //           caches.keys().then((cacheNames) => {
  //             cacheNames.forEach((cacheName) => {
  //               caches.delete(cacheName);
  //             });
  //           });
  //         }
  //       });
  //       await page.close();
  //     } catch (error) {
  //       console.log("something wrong");
  //     }
  //   }

  try {
    const randomValue = generateRandomNumber();
    // await page.click(page);
    await page.waitForSelector(".show-more-less-button");

    await page.click(".show-more-less-button");
    await page.waitForSelector(".top-card-layout__title");
    const jobTitleSelector = await page.$(".top-card-layout__title");
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

    console.log("details ===> ", {
      jobTitle,
      company,
      location,
      postedAt,
      applicants,
      strength,
      jobtype,
      companyLink,
      //   jobLink,
    });
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
  } catch (error) {
    console.log("something wrong");
  }
};
