import * as puppeteer from "puppeteer";

it("renders login screen", async () => {
  let browser = await puppeteer.launch({
    headless: false,
  });
  let page = await browser.newPage();

  page.emulate({
    viewport: {
      width: 1000,
      height: 2500,
    },
    userAgent: "",
  });

  await page.goto("http://localhost:3000");
  await page.waitForSelector("h1");

  const html = await page.$eval("h1", (e) => e.innerHTML);
  expect(html).toBe("Sign in");

  browser.close();
}, 16000);
