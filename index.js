const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {
  getInstagramCount,
  getTwitterCount,
  getYoutubeCount,
  runJob,
  db,
  waker
} = require("./lib/scraper");
//import "./lib/cron";
// const db = require("./lib/aggregate");
//import db from "./lib/db";
//const { aggregate } = require("./lib/aggregate.js");

const app = express();
const port = process.env.PORT || 2083;
app.use(
  cors({
    origin: "https://build-lac-eight.now.sh"
  })
);

// Use the PORT variable provided OR use the declared port of :2093
app.listen(port, () => {
  console.log(`Starting server at ${port}`);
});

// Run the job every hour
const interval_time = 1000 * 60 * 10;

const interval_time2 = 1000 * 60 * 15;

setInterval(() => {
  console.log("Wake up...Neo");
  waker("https://scraper-bot-jy.herokuapp.com/aggregate");
}, interval_time2);

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

app.get("/aggregate", async (req, res, next) => {
  // Get the scrape Data
  const { twitter, instagram, youtube } = db.value();
  // Aggregate these values
  res.json({
    twitter: twitter,
    instagram: instagram,
    youtube: youtube
  });
  // Respond with JSON
});
