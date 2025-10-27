import { encryptPin, computeHmacHex } from '../index';

describe('payments helpers', () => {
  test('encryptPin returns non-empty string and different than input', () => {
    const pin = '1234';
    const key = 'a'.repeat(64);
    const encrypted = encryptPin(pin, key);
    expect(typeof encrypted).toBe('string');
    expect(encrypted.length).toBeGreaterThan(0);
    expect(encrypted).not.toBe(pin);
  });

  test('computeHmacHex matches manual hmac', () => {
    const secret = 'test-secret';
    const payload = JSON.stringify({ hello: 'world' });
    const expected = computeHmacHex(payload, secret);

    // Compute manually using node crypto
    const crypto = require('crypto');
    const manual = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    expect(expected).toBe(manual);
  });
});
