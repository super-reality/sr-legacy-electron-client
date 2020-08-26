/* eslint-env jest-puppeteer */
import puppeteer from "puppeteer";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import net from "net";

jest.setTimeout(60000);

expect.extend({ toMatchImageSnapshot });

const client = new net.Socket();
let startedJest = false;

const tryConnection = () => {
  return new Promise((resolve) => {
    client.connect({ port: 3000 }, () => {
      client.end();
      if (!startedJest) {
        console.log("Connection ok!");
        startedJest = true;
        resolve();
      }
    });

    client.on("error", () => {
      setTimeout(tryConnection, 1000);
    });
  });
};

beforeAll((done) => {
  tryConnection();
  done();
});

describe("it renders", () => {
  test("it matches snapshots", async (done) => {
    const browser = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
      args: [`--window-size=350,800`],
    });
    const page = await browser.newPage();

    await page.setViewport({
      width: 350,
      height: 800,
    });

    await page.goto("http://localhost:3000");
    await page.waitForSelector("#root > div > div.button-simple.undefined");

    const btn = await page.$("#root > div > div.button-simple.undefined");
    const btnText = await page.$eval(
      `#root > div > div.button-simple.undefined`,
      (e) => e.innerHTML
    );
    expect(btnText).toEqual("Login");

    const splashImage = await page.screenshot();
    expect(splashImage).toMatchImageSnapshot();

    if (btn) await btn.click();

    const loginImage = await page.screenshot();
    expect(loginImage).toMatchImageSnapshot();

    browser.close();
    done();
  });
});
