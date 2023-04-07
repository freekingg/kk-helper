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

async function getCookie(page) {
  const cookies = await page.evaluate(() => {
    return document.cookie;
  });
  return cookies;
}

async function getToken(page) {
  return new Promise(resolve => {
    let sensorDatas = [];
    page.on('request', interceptedRequest => {
      if (['font'].includes(interceptedRequest.resourceType())) {
        return interceptedRequest.abort();
      }
      if (interceptedRequest.resourceType() === 'xhr') {
        let postData = interceptedRequest.postData();
        if (postData && postData.indexOf('sensor_data') !== -1) {
          sensorDatas.push(postData);
        }
      }
      if (sensorDatas.length > 1) {
        resolve(sensorDatas);
      }
      return interceptedRequest.continue();
    });
  });
}

const token = async (page, opts) => {
  console.log('opts: ', opts);
  await page.setRequestInterception(true);
  let sensorDatas = [];
  getToken(page).then(result => {
    sensorDatas = result;
  });
  await page.goto(opts.url, { timeout: 120000 });
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
