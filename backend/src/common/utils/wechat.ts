export async function exchangeCodeForSession(code: string) {
  // Placeholder for WeChat API call. In MVP we return mock data.
  return {
    openid: `mock-openid-${code}`,
    sessionKey: `mock-session-${code}`,
  };
}

export function decryptPhoneNumber(_sessionKey: string, _encryptedData: string, _iv: string) {
  // In production this would use WXBizDataCrypt. Here we return mock phone.
  return {
    phoneNumber: '13800000000',
  };
}
