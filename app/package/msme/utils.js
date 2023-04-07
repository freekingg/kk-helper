/* eslint-disable no-undef */
/**
 * 获取网页本地存储
 * @date 2023-04-07
 * @param {any} page
 * @returns {any}
 */
async function getLocalStorage(page) {
  const localStorageData = await page.evaluate(() => {
    let json = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      json[key] = localStorage.getItem(key);
    }
    return json;
  });
  return localStorageData;
}

/**
 * 获取网页cookie
 * @date 2023-04-07
 * @param {any} page
 * @returns {any}
 */
async function getCookie(page) {
  const cookies = await page.evaluate(() => {
    return document.cookie;
  });
  return cookies;
}

/**
 * 延时方法
 * @date 2023-04-07
 * @param {any} timeout
 * @returns {any}
 */
function waitForTimeout(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export { getLocalStorage, getCookie, waitForTimeout };
