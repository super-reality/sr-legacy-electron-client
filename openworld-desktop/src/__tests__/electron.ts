/* eslint-disable no-await-in-loop */
/* eslint-env jest-puppeteer */
import puppeteer from "puppeteer";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import net from "net";

jest.setTimeout(60000);

const matchConfig: any = {
  comparisonMethod: "ssim",
  customDiffConfig: {
    ssim: "fast",
  },
  failureThreshold: 0.01,
  failureThresholdType: "percent",
};

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
      headless: true,
      ignoreHTTPSErrors: true,
      args: ["`--window-size=350,800", "--no-sandbox"],
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
    expect(splashImage).toMatchImageSnapshot(matchConfig);

    if (btn) await btn.click();

    const loginImage = await page.screenshot();
    expect(loginImage).toMatchImageSnapshot(matchConfig);

    for (let i = 0; i < 5; i += 1) {
      await page.goto(`http://localhost:3000/#/tests/${i}`);
      const img = await page.screenshot();
      expect(img).toMatchImageSnapshot(matchConfig);
    }

    browser.close();
    done();
  });
});
