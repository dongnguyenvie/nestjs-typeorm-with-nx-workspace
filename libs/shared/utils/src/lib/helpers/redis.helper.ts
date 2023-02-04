import * as R from 'ramda';

class RedisHelper {
  public jsonEncode(data: Record<string, any>) {
    return JSON.stringify(data);
  }

  public jsonDecode<T = unknown>(data: string): T {
    try {
      return JSON.parse(data as any);
    } catch (error) {
      return data as unknown as T;
    }
  }

  public jsonDecodeObject<T extends Record<string, any> | Array<string>>(data: T, toArray = false) {
    if (R.is(Array, data)) {
      return data.map((d) => this.jsonDecode(d));
    }

    if (R.is(Object, data)) {
      if (toArray) {
        return Object.keys(data).map((key) => this.jsonDecode(data[key]));
      }

      const _newData = {} as Record<string, any>;
      for (const key in data) {
        _newData[key] = this.jsonDecode((data as any)[key]);
      }
      return _newData as T;
    }
  }
}

export const redisHelper = new RedisHelper();
