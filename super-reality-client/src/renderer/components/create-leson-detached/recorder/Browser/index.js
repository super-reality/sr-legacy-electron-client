// eslint-disable-next-line no-undef
const puppeteer = __non_webpack_require__("puppeteer");

export default class Browser {
  constructor() {
    this._processOwner = "";
    this._windowTitle = "";
    this._browser = null;
    this._page = null;

    this.checkIfBrowser = this.checkIfBrowser.bind(this);
    this.getBrowserUrl = this.getBrowserUrl.bind(this);
  }

  set title(str) {
    if (!str) throw new Error("Exception set windowTitle");

    this._windowTitle = str;
  }

  set owner(str) {
    if (!str) throw new Error("Exception set processOwner");

    this._processOwner = str;
  }

  checkIfBrowser() {
    const processNameAndExt = this._processOwner.split(".");
    const processName = processNameAndExt[0];
    if (
      processName === "chrome" ||
      processName === "opera" ||
      processName === "firefox" ||
      processName === "msedge"
    ) {
      return processName;
    }

    return "";
  }

  async createBrowser() {
    this._browser = await puppeteer.launch({ headless: true }); // for test disable the headlels mode,
    this._page = await this._browser.newPage();
    await this._page.setViewport({ width: 1000, height: 800 });
  }

  async getBrowserUrl() {
    let url = "";
    let title = this._windowTitle.substr(0, this._windowTitle.lastIndexOf("-"));
    console.log("getBrowserUrl => Title =>", title);

    if (title != "") {
      return this.createBrowser().then(async () => {
        try {
          title = title.replace("|", "");
          await this._page.goto(`https://duckduckgo.com/?q=${title}`, {
            waitUntil: "networkidle0",
          });

          url = await this._page.evaluate(() => {
            const tds = Array.from(
              document
                .querySelector(
                  "#links #r1-0 div.result__body h2.result__title a.result__a"
                )
                .getAttribute("href")
            );
            return tds.map((td) => td);
          });
        } catch (e) {
          console.log("pupeteer crashed");
          this._browser.close();
          return "";
        }

        this._browser.close();
        console.log("url =>", url.join(""));

        return url.join("");
      });
    }
    return "";
  }
}
