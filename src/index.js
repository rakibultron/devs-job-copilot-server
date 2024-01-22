const express = require("express");
const Redis = require("ioredis");
const cron = require("node-cron");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const queue = require("./queues/job_scrapper_queue");

const techs = [
  "express.js",
  "react.js",
  "node.js",
  "mern stack",
  "javascript developer",
];
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
  "Brunei ",
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
  "Democratic Republic of the Congo",
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
  'Eswatini (fmr. "Swaziland")',
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
  "North Macedonia",
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

// queue init
// (() => {
//   for (const tech of techs) {
//     for (const country of countries) {
//       const data = { tech, country };
//       //   const data = "hello";
//       //   console.log({ data });

//       queue.add(data, { removeOnComplete: true, removeOnFail: true });
//     }
//   }
// })();

// // Schedule to add entries to the queue every 6 hours
// cron.schedule("0 */3 * * *", () => {
//   for (const tech of techs) {
//     for (const country of countries) {
//       const data = { tech, country };

//       queue.add(data, { removeOnComplete: true, removeOnFail: true });
//     }
//   }

//   console.log("Entries added to the queue.");
// });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: [`http://localhost:5173`],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // preflightContinue: true,
    // optionsSuccessStatus: 204,
  })
);

const port = 5000;

// API routes
function loadRoutes(app) {
  const routesDir = path.join(__dirname, "routes");

  fs.readdirSync(routesDir).forEach((file) => {
    const routePath = path.join(routesDir, file);
    const routeModule = require(routePath);
    // console.log(routeModule);

    app.use(routeModule);
  });
}

loadRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
