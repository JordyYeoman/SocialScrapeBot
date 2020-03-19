// Setup the DB
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);
// Set some defaults (required if your JSON file is empty)
db.defaults({ twitter: [], instagram: [], youtube: [] }).write();

const puppeteer = require("puppeteer");

// Scrape Twitter Profile
async function scrapeTwitter(url) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  //   await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

  await page.goto(url, { waitUntil: "networkidle2" });
  // // Take screenshot for testing purposes
  // await page.screenshot({ path: "screenshot.png" });

  const [el] = await page.$x(
    '//*[@id="react-root"]/div/div/div/main/div/div/div/div/div/div/div/div/div[1]/div[2]/div[4]/div[2]/a/span[1]/span'
  );
  const followersText = await el.getProperty("textContent");
  const followers = await followersText.jsonValue();
  browser.close();

  return { followers };
}

// Scrape Instagram Profile
async function getInstagramFollowers(url) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  //   await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

  await page.goto(url, { waitUntil: "networkidle2" });
  // // Take screenshot for testing purposes
  // await page.screenshot({ path: "screenshot.png" });

  const [el] = await page.$x(
    '//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a/span'
  );
  const followersText = await el.getProperty("textContent");
  const followers = await followersText.jsonValue();
  browser.close();

  return { followers };
}

// Scrape Youtube Channel
async function getYoutubeFollowers(url) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitFor(8000);
  // // Take screenshot for testing purposes
  // await page.screenshot({ path: "screenshot.png" });

  const [el] = await page.$x(
    '//*[@id="c4-primary-header-contents"]/div/div/div[2]/div/span/span[1]'
  );
  const subscribersText = await el.getProperty("textContent");
  const subscribers = await subscribersText.jsonValue();
  browser.close();

  return { subscribers };
}
//*[@id="subscriber-count"]

async function getTwitterCount() {
  // Scrape Twitter
  const twitterURL = "https://twitter.com/JordyYeoman";
  const twCount = await scrapeTwitter(twitterURL);
  const twitterCount = twCount.followers;
  return twitterCount;
}

async function getInstagramCount() {
  // Scrape Instagram
  const instaURL = "https://www.instagram.com/jordy_yeoman/";
  const instaFollowers = await getInstagramFollowers(instaURL);
  const instaCount = instaFollowers.followers;
  return instaCount;
}

async function getYoutubeCount() {
  // Scrape Youtube
  const youtubeURL = "https://www.youtube.com/draxen";
  const youtubeSubscribers = await getYoutubeFollowers(youtubeURL);
  const youtubeCount = youtubeSubscribers.subscribers;
  return youtubeCount;
}

async function runJob() {
  const [iCount, tCount, yCount] = await Promise.all([
    getInstagramCount(),
    getTwitterCount(),
    getYoutubeCount()
  ]);

  //Get Twitter Scrape Data and push to the database
  db.get("twitter")
    .push({
      date: Date.now(),
      count: tCount
    })
    .write();
  //Get Instagram Scrape Data and push to the database
  db.get("instagram")
    .push({
      date: Date.now(),
      count: iCount
    })
    .write();
  db.get("youtube")
    .push({
      date: Date.now(),
      count: yCount
    })
    .write();
  console.log("Done!");
}

// Scrape Twitter Profile
async function waker() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  //   await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitFor(4000);
  // // Take screenshot for testing purposes
  // await page.screenshot({ path: "screenshot.png" });

  // const [el] = await page.$x(
  //   '//*[@id="react-root"]/div/div/div/main/div/div/div/div/div/div/div/div/div[1]/div[2]/div[4]/div[2]/a/span[1]/span'
  // );
  // const followersText = await el.getProperty("textContent");
  // const followers = await followersText.jsonValue();
  // browser.close();

  return;
}

module.exports = {
  getInstagramCount,
  getTwitterCount,
  getYoutubeCount,
  runJob,
  waker,
  db
};
