import dotenv from 'dotenv';

type AppConfig = {
  jwtSecret: string;
  jwtExpiresIn: string;
  wechatAppId: string;
  wechatAppSecret: string;
  wechatPayMchId: string;
  wechatPayPrivateKey: string;
};

let config: AppConfig | null = null;

export function loadConfig() {
  dotenv.config();
  config = {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    wechatAppId: process.env.WECHAT_APP_ID || 'mock-app-id',
    wechatAppSecret: process.env.WECHAT_APP_SECRET || 'mock-secret',
    wechatPayMchId: process.env.WECHAT_PAY_MCH_ID || 'mch_mock',
    wechatPayPrivateKey: process.env.WECHAT_PAY_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\nMOCK\n-----END PRIVATE KEY-----',
  };
}

export function getConfig(): AppConfig {
  if (!config) {
    loadConfig();
  }
  return config!;
}
