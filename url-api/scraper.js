const puppeteer = require('puppeteer');
const express = require('express');

const Queue = require('bull');
const debug = require('debug')('scraper');
const normalizeUrl = require('normalize-url');
const mongoose = require('mongoose');

const app = express();

const queue = new Queue('bikroy');

const Site = require('./models/site');

queue.process(1, async ({ data }) => {
  console.log(data);
  const { url } = data;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // go to the page
  debug('Go to the page', url);
  await page.goto(normalizeUrl(url));

  const title = await page.title();

  debug('Take screenshot');
  const screenshotsPath = `../screenshots/${Date.now()}.png`;
  await page.screenshot({ path: screenshotsPath });

  await new Site({
    requested: true,
    processedOn: Date.now(),
    title,
    screenshotsPath,
  }).save();

  await browser.close();
});

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', (err) => {
  console.error(`ERROR → ${err.message}`);
});

// get all sites
app.get('/', async (req, res) => {
  const site = await Site.find();
  res.json({ site });
});

// create a site
app.get('/add', async (req, res) => {
  const { url } = req.query;

  await queue.add({ url });

  res.send({ message: `${url} is Added to queue` });
});

// get site by id
app.get('/site/:id', async (req, res) => {
  const { id } = req.params;
  const site = await Site.findById(id);

  if (!site) {
    return res.status(404).json({ msg: 'Site not found' });
  }

  res.json(site);
});

app.listen(3000, () => console.log('Server is listening...'));


// curl "http://localhost:3000/add?url=test.com"
// curl "http://localhost:3000/add?url=bikroy.com"
// curl "http://localhost:3000/add?url=deligram.com"
// curl "http://localhost:3000/add?url=khaasfood.com"
// curl "http://localhost:3000/add?url=demo.realworld.io"
