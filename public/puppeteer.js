const { dialog, BrowserWindow, app } = require("electron");
const pie = require("puppeteer-in-electron");
const puppeteerCore = require("puppeteer-core");

class Puppeteer {
  _browser = null;

  _window = null;

  _page = null;

  constructor() {
    const main = async () => {
      await pie.initialize(app);
      this._browser = await pie.connect(app, puppeteerCore);
    };

    main();
    this.loadUrl = this.loadUrl.bind(this);
    this.initWindow = this.initWindow.bind(this);
  }

  initWindow() {
    this._window = new BrowserWindow({
      show: false,
    });
    // this._window.destroy();
  }

  get page() {
    return this._page;
  }

  async loadUrl(url) {
    await this._window.loadURL(url);
    const page = await pie.getPage(this._browser, this._window);
    this._page = page;
    return page;
  }

  async getDuckDuckGoUrl(title) {
    return this.loadUrl(`https://duckduckgo.com/?q=${title}`).then((page) =>
      page.$eval(
        "#r1-0 > div > div.result__extras.js-result-extras > div > a",
        (e) => e.textContent
      )
    );
  }
}

module.exports = Puppeteer;
