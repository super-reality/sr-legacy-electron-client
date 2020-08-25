/* eslint-env jest-puppeteer */
import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

jest.setTimeout(20000);

describe("Teacher.Bot", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:3000");
  });

  it('should be titled "Teacher.Bot"', async () => {
    await expect(page.title()).resolves.toMatch("Teacher.Bot");
  });
});
