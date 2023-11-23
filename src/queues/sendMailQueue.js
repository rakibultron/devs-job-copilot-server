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
const mailGun = require("../helpers/mail");

puppeteer.use(StealthPlugin());
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());

const redisOptions = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USER_NAME,
  password: process.env.REDIS_PASSWORD,
};

// const redis = new Redis(redisOptions);

const mailQueue = new Bull("mail_queue", {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
});

mailQueue.process(async (job) => {
  //   console.log("sending mail =====>", job);
  const { data } = job;

  await mailGun(data);
});

module.exports = mailQueue;
