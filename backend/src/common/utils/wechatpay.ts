import crypto from 'crypto';

import { getConfig } from '../../config/config';

export function createMockPrepay(orderNo: string, amount: number) {
  const nonceStr = crypto.randomBytes(16).toString('hex');
  const timestamp = Math.floor(Date.now() / 1000).toString();
  return {
    prepayId: `mock_prepay_${orderNo}`,
    nonceStr,
    timestamp,
    signType: 'RSA',
    paySign: crypto.createHash('sha256').update(orderNo + amount + nonceStr + timestamp).digest('hex'),
    mchId: getConfig().wechatPayMchId,
  };
}

export function verifyMockSignature(): boolean {
  // Placeholder always true for MVP.
  return true;
}
