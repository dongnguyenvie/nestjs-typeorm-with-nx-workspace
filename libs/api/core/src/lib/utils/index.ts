import dayjs from '@noinghe/shared/utils/lib/libs/dayjs';

export * from './pagination.util';

export function decodeCursor(encodedCursor: string) {
  try {
    const buff = new Buffer(encodedCursor, 'base64');
    const text = buff.toString('ascii');
    const arrStr = text.split(',');
    const [time, uuid] = arrStr;
    return [time, uuid];
  } catch (error) {
    return false;
  }
}

export function encodeCursor(time: string, uuid: string) {
  const now = dayjs(time).utc().unix();
  const buff = new Buffer(`${now},${uuid}`);
  const base64data = buff.toString('base64');

  return base64data;
}

export const decodeScope = (scp = '') => {
  const [methodKey, action] = scp.split('.');
  return [methodKey, action];
};

export const getProxy = () => {
  // const proxy = (process.env.PROXY_1 || '').split(':');
  // return {
  //   ip: proxy[0],
  //   port: proxy[1],
  //   user: proxy[2],
  //   pass: proxy[3],
  // };
  const proxy = (process.env.PROXY_TOR || '').split('::');
  return {
    ip: proxy[0],
    port: proxy[1],
  };
};

export const removeObjectEmpty = <T>(obj: T): T => {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
  return obj;
};
