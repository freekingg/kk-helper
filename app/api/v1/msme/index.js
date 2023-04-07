import { LinRouter, NotFound, disableLoading } from 'lin-mizar';
import { PuppeteerYesbank } from '../../../package/msme';
// 实例
const msmeApi = new LinRouter({
  prefix: '/v1/msme',
  module: 'msme'
});

const Instance = new PuppeteerYesbank();
msmeApi.get('/token', async ctx => {
  const timeStart = new Date().getTime();
  const [err, resp] = await Instance.start({
    url: 'https://yesmsmeonline.yesbank.in/homepage#!/login'
  });
  if (!resp) {
    throw new NotFound({ message: err.message });
  }
  Instance.close();
  const time = new Date().getTime() - timeStart;
  ctx.json({
    ...resp,
    time
  });
});

module.exports = { msmeApi, [disableLoading]: false };
