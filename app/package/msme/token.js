import { getLocalStorage, getCookie, waitForTimeout } from './utils';

/**
 * 监听请求
 * @date 2023-04-07
 * @param {any} page
 * @returns {any}
 */
async function listenReq(page) {
  return new Promise(resolve => {
    let sensorDatas = [];
    page.on('request', interceptedRequest => {
      if (['font', 'png', 'stylesheet', 'jpeg'].includes(interceptedRequest.resourceType())) {
        return interceptedRequest.abort();
      }
      if (interceptedRequest.resourceType() === 'xhr') {
        let postData = interceptedRequest.postData();
        if (postData && postData.indexOf('sensor_data') !== -1) {
          sensorDatas.push(postData);
        }
      }
      if (sensorDatas.length) {
        resolve(sensorDatas);
      }
      return interceptedRequest.continue();
    });
  });
}

/**
 * 获取鉴权相关数据
 * @date 2023-04-07
 * @param {any} page
 * @param {any} opts
 * @returns {any}
 */
const token = async (page, opts) => {
  await page.setRequestInterception(true);
  let sensorDatas = [];
  listenReq(page).then(result => {
    sensorDatas = result;
  });
  await page.goto(opts.url, { timeout: 120000 });
  await waitForTimeout(1000);
  let localStorage = await getLocalStorage(page);
  let cookie = await getCookie(page);
  let authData = {
    localStorage,
    cookie,
    sensorDatas
  };
  return authData;
};

export default token;
