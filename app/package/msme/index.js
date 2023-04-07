import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dayjs from 'dayjs';
import token from './token';

puppeteer.use(StealthPlugin());

let launchOptions = {
  timeout: 120000,
  headless: true,
  ignoreHTTPSErrors: true,
  args: [
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-web-security',
    '--disable-xss-auditor',
    '--disable-accelerated-2d-canvas',
    '--ignore-certifcate-errors',
    '--ignore-certifcate-errors-spki-list',
    '--disable-setuid-sandbox',
    '--no-sandbox',
    '--disable-webgl',
    '--no-zygote',
    '--allow-running-insecure-content', // 允许不安全内容
    '--disable-popup-blocking',
    '--disable-infobars',
    '--disable-features=IsolateOrigins,site-per-process'
  ],
  'ignoreDefaultArgs': ["--enable-automation"],
  'devtools': true,
  'dumpio': true
};

/**
 * puppeteer 自动化执行类
 *
 * @param {Object} [opts={ }] - Options
 * @param {Object} [opts.browser] - Puppeteer browser instance to use
 * @param {Object} [opts.puppeteer] - Puppeteer [launch options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)
 */
class PuppeteerYesbank {
  constructor(opts = {}) {
    this._opts = opts;
    this.launchOptions = launchOptions;
    this.init = false; // 是否初始化完成 - 主要用于第一次登录时间较长控制
    this.page = null;
    this.lastDateTime = null;
  }

  /**
   * Puppeteer 实例
   *
   * @return {Promise<Object>}
   */
  async browser() {
    if (!this._browser) {
      let launchOptions = {
        ...this.launchOptions
      };
      this._browser = await puppeteer.launch(launchOptions);
      this._browser.on('disconnected', e => {
        console.log('浏览器关闭了', e);
        this._browser = null;
      });
    }
    return this._browser;
  }

  /**
   * 执行任务
   *
   * @param {Object} opts - 参数
   * @return {Promise}
   *
   */
  async start(opts = {}) {
    const browser = await this.browser();
    const page = await browser.newPage();
    let ua = opts.ua || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
    console.log('ua: ', ua);
    await page.setUserAgent(ua)
    const headers = {
      'Accept-Encoding': 'gzip'
    };

    try {
      await page.setExtraHTTPHeaders(headers);
      const resp = await token(page, opts);
      await page.waitForTimeout(1000);
      this.init = true;
      this.page = page;
      return [null, resp];
    } catch (error) {
      console.log('error: ', error);
      return [error, this.page];
    }
  }

  /**
   * 关闭实例
   *
   * @return {Promise}
   */
  async close() {
    const browser = await this.browser();
    await browser.close();
    this._browser = null;
  }
}

export { PuppeteerYesbank };
