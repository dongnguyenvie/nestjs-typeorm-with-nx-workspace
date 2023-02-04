export interface IEnvironment {
  googleConfig: {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  };
  facebookConfig: {
    clientId: string;
    clientSecret: string;
    oauthRedirectUri: string;
  };
  apiConfigOptions: {
    baseUrl: string;
  };
  clientBaseUrl: string;
  redisConfig: {
    host: string;
    port: number;
    db: number;
    password: string;
    keyPrefix: string;
  };
}
