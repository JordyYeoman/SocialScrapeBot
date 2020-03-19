const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {
  getInstagramCount,
  getTwitterCount,
  getYoutubeCount,
  runJob
} = require("./lib/scraper");
//import "./lib/cron";
//import db from "./lib/db";
//import aggregate from "./lib/aggregate.js";

const app = express();
const port = process.env.PORT || 2083;
app.use(cors());

// Use the PORT variable provided OR use the declared port of :2093
app.listen(port, () => {
  console.log(`Starting server at ${port}`);
});

// Run the job every hour
const interval_time = 1000 * 60 * 60;

setInterval(() => {
  runJob();
}, interval_time);

app.get("/scrape", async (req, res, next) => {
  console.log("Scraping!!!");
  const [iCount, tCount, yCount] = await Promise.all([
    getInstagramCount(),
    getTwitterCount(),
    getYoutubeCount()
  ]);
  res.json({ iCount, tCount, yCount });
});

// app.get("/aggregate", async (req, res, next) => {
//   // Get the scrape Data
//   const { twitter, instagram, youtube } = db.value();
//   // Aggregate these values
//   res.json({
//     twitter: aggregate(twitter),
//     instagram: aggregate(instagram),
//     youtube: aggregate(youtube)
//   });
//   // Respond with JSON
// });
