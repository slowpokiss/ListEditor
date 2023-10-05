import puppetteer from "puppeteer";
import { fork } from "child_process";

jest.setTimeout(30000); // default puppeteer timeout

describe("Credit Card Validator form", () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = "http://localhost:9000";

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on("error", reject);
      server.on("message", (message) => {
        if (message === "ok") {
          resolve();
        }
      });
    });

    browser = await puppetteer.launch({
      headless: "new", // show gui
      slowMo: 25,
      devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  // test("popover show test", async () => {
  //   await page.goto(baseUrl);
  //   await page.waitForSelector(".main");

  //   const popBtn = await page.$(".btn");
  //   await popBtn.click();
  //   await page.waitForSelector(".arrow");
  // });

  // test("popover position test", async () => {
  //   await page.goto(baseUrl);

  //   const popBtn = await page.$(".btn");
  //   await popBtn.click();

  //   const popEl = await page.$(".arrow");
  //   const popElBounding = await page.evaluateHandle((element) => {
  //     const rect = element.getBoundingClientRect();
  //     return {
  //       x: rect.x,
  //       y: rect.y,
  //       width: rect.width,
  //       height: rect.height,
  //       top: rect.top,
  //       right: rect.right,
  //       bottom: rect.bottom,
  //       left: rect.left,
  //     };
  //   }, popEl);

  //   const popCoords = await popElBounding.jsonValue();

  //   const btnEl = await page.$(".btn");
  //   const btnElBounding = await page.evaluateHandle((element) => {
  //     const rect = element.getBoundingClientRect();
  //     return {
  //       x: rect.x,
  //       y: rect.y,
  //       width: rect.width,
  //       height: rect.height,
  //       top: rect.top,
  //       right: rect.right,
  //       bottom: rect.bottom,
  //       left: rect.left,
  //     };
  //   }, btnEl);

  //   const btnCoords = await btnElBounding.jsonValue();

  //   const resultX = Math.round(
  //     btnCoords.left + btnCoords.width / 2 - popCoords.width / 2
  //   );
  //   const resultTop = Math.round(btnCoords.top - popCoords.top - 10);

  //   expect(resultX).toBe(Math.round(popCoords.left));
  //   expect(resultTop).toBe(Math.round(popCoords.height));
  // });

  // test("popover 2nd show test", async () => {
  //   await page.goto(baseUrl);
  //   await page.waitForSelector(".main");

  //   const popBtn = await page.$(".btn");

  //   await popBtn.click();
  //   await popBtn.click();
  //   await popBtn.click();

  //   await page.waitForSelector(".arrow");
  // });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });
});
