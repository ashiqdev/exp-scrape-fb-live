const puppeteer = require('puppeteer');
const debug = require('debug')('scraper');
const Queue = require('bull');
const cookies = require('./cookies.json');

const queue = new Queue('bikroy');


queue.process(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // set cookies so that we can skip the form submit procedure.
  debug('set cookies');
  await page.setCookie(...cookies);
  // go to the page
  await page.goto('https://bikroy.com/');

  //  4. wait for .hide-for-inactive to be visible
  debug('Wait For Login...');
  await page.waitForSelector('.hide-for-inactive', { visible: true });

  // 5.  go to ads page
  debug('Go to ads page...');
  await page.goto('https://bikroy.com/en/ads');

  // 6. get all ads
  debug('Getting all ads...');
  const ads = await page.evaluate(() => {
    return [
      ...document.querySelectorAll('[data-testid="ad-meta"] .title--3yncE'),
    ].map((e) => e.innerText);
  });

  console.log({ ads });

  //  7. take screenshot
  debug('Take Screenshot');
  await page.screenshot({ path: `screenshots/${Date.now()}.png` });

  await browser.close();

  //   done();
});

// queue.add(
//   {},
//   {
//     repeat: {
//       every: '30000',
//       limit: 2,
//     },
//   }
// );

//  api will get the links
//  it will get added to the queue
// save the data in db
