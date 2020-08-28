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
  failureThreshold: 0.05,
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
      args: [
        "`--window-size=350,800",
        "--no-sandbox",
        "--font-render-hinting=none",
      ],
    });
    const page = await browser.newPage();

    await page.setViewport({
      width: 350,
      height: 800,
    });

    // Test pages
    for (let i = 0; i < 5; i += 1) {
      await page.goto(`http://localhost:3000/#/tests/${i}`);
      await page.waitFor(1000);
      const img = await page.screenshot();
      expect(img).toMatchImageSnapshot(matchConfig);
    }

    // Go to root / splash
    await page.goto("http://localhost:3000");
    await page.waitForSelector("#root > div > div.button-simple.undefined");

    const btn = await page.$("#root > div > div.button-simple.undefined");
    const btnText = await page.$eval(
      `#root > div > div.button-simple.undefined`,
      (e) => e.innerHTML
    );
    expect(btnText).toEqual("Login");

    // Welcome splash
    const splashImage = await page.screenshot();
    expect(splashImage).toMatchImageSnapshot(matchConfig);

    if (btn) await btn.click();

    // Login form
    const loginImage = await page.screenshot();
    expect(loginImage).toMatchImageSnapshot(matchConfig);

    // Replicate login process
    await page.$eval(
      "#root > div > div > form > fieldset > div:nth-child(1) > input[type=text]",
      (e: any) => {
        e.value = "manwe@gmail.com";
      }
    );
    await page.$eval(
      "#root > div > div > form > fieldset > div:nth-child(2) > input[type=password]",
      (e: any) => {
        e.value = "password";
      }
    );
    const loginSubmit = await page.$(
      "#root > div > div > form > fieldset > div:nth-child(3) > div.button-simple.button-login"
    );

    if (loginSubmit) await loginSubmit.click();

    // Wait for root / login suceess
    await page.waitForSelector("#root > div.top-search-container");
    const rootImage = await page.screenshot();
    expect(rootImage).toMatchImageSnapshot(matchConfig);

    await page.goto(`http://localhost:3000/#/learn/1`);
    await page.waitFor(1000);
    const learn = await page.screenshot();
    expect(learn).toMatchImageSnapshot(matchConfig);

    await page.goto(`http://localhost:3000/#/create/0`);
    await page.waitFor(1000);
    const create = await page.screenshot();
    expect(create).toMatchImageSnapshot(matchConfig);

    browser.close();
    done();
  });
});
