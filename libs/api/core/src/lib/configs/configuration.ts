export const configuration = () => {
  return {
    ...process.env,
    googleConfig: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    facebookConfig: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    },
    apiConfigOptions: {
      baseUrl: process.env.API_URL,
    },
    clientBaseUrl: process.env.WEB_URL,
    redisConfig: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      db: parseInt(process.env.REDIS_DB || '0'),
      password: process.env.REDIS_PASSWORD,
      keyPrefix: process.env.REDIS_PRIFIX,
    },
  };
};
