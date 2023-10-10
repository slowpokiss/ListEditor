import puppetteer from "puppeteer";
import { fork } from "child_process";
import { createInflate } from "zlib";

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
      // headless: false,
      // slowMo: 25,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  test("show test", async () => {
    await page.goto(baseUrl);
    await page.waitForSelector(".main");
  });

  test("addCard test && showPopover test", async () => {
    await page.goto(baseUrl);

    const addBtn = await page.$(".list-add");

    await addBtn.click();
    const form = await page.$(".list-popup.active");
    const inputName = await form.$(".popup-input.popup-input-name");
    const inputValue = await form.$(".popup-input.popup-input-value");
    const submit = await form.$(".popup-button.popup-save");

    await inputName.type("Iphone 15");
    await submit.click();
    await page.waitForSelector(".arrow");

    await inputValue.type("0");
    await submit.click();
    await page.waitForSelector(".arrow");

    await inputValue.click({ clickCount: 1 });
    await page.keyboard.press("Backspace");
    await inputValue.type("1000");
    await submit.click();
    const cardListLength = await page.$$eval(
      ".item-card",
      (elements) => elements.length
    );

    expect(cardListLength).toBe(5);
  });

  test("editCard test", async () => {
    await page.goto(baseUrl);

    const editBtn = await page.$(".action-edit");

    await editBtn.click();
    const form = await page.$(".list-popup.active");
    const inputName = await form.$(".popup-input.popup-input-name");
    const inputValue = await form.$(".popup-input.popup-input-value");
    const submit = await form.$(".popup-button.popup-save");

    await inputName.click({ clickCount: 2 });
    await page.keyboard.press("Backspace");
    await inputName.type("15");
    await submit.click();

    const cardListLength = await page.$$eval(
      ".item-card",
      (elements) => elements.length
    );

    expect(cardListLength).toBe(4);
  });

  test("delCard test", async () => {
    await page.goto(baseUrl);

    const cardList = await page.$(".items");
    const card = await cardList.$(".item-card");

    const cardDel = await card.$(".action-delete");
    await cardDel.click();

    const cardListLength = await page.$$eval(
      ".item-card",
      (elements) => elements.length
    );

    expect(cardListLength).toBe(3);
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });
});
