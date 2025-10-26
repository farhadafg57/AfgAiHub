'use server';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineString } from 'firebase-functions/params';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

// Environment secrets and variables from .env
const hesabpayApiKey = defineString('HESABPAY_API_KEY');
const hesabpayApiUrl = defineString('HESABPAY_BASE_URL');
const hesabpaySandboxUrl = defineString('HESABPAY_SANDBOX_URL');
const merchantPin = defineString('MERCHANT_PIN');

/**
 * Creates a payment session with HesabPay.
 */
export const createPaymentSession = onCall(async (request) => {
  const { items, email, redirectSuccess, redirectFailure } = request.data;
  const userId = request.auth?.uid;

  // Improved input validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new HttpsError('invalid-argument', 'The function must be called with a non-empty "items" array.');
  }
  for (const item of items) {
    if (typeof item.name !== 'string' || typeof item.price !== 'number' || typeof item.id !== 'string') {
        throw new HttpsError('invalid-argument', 'Each item must have a string id, a string name, and a numeric price.');
    }
  }


  const apiKey = hesabpayApiKey.value();
  const baseUrl = hesabpayApiUrl.value();
  const endpoint = `${baseUrl}/payment/create-session`;

  const headers = {
    'Authorization': `API-KEY ${apiKey}`,
    'accept': 'application/json',
    'Content-Type': 'application/json',
  };

  const payload: any = {
    items,
    email,
  };
  if(redirectSuccess) payload.redirect_success_url = redirectSuccess;
  if(redirectFailure) payload.redirect_failure_url = redirectFailure;
  

  try {
    const response = await axios.post(endpoint, payload, { headers });
    const { paymentUrl } = response.data;
    const sessionId = uuidv4();

    const sessionData = {
      sessionId,
      userId: userId || null,
      guest: !userId,
      email,
      items,
      status: 'pending',
      paymentUrl,
      createdAt: new Date().toISOString(),
    };
    
    // Storing session in a structured path
    await db.collection('payments').doc('sessions').collection(sessionId).doc(sessionId).set(sessionData);

    return { success: true, paymentUrl, sessionId };
  } catch (err) {
    console.error('Error creating HesabPay payment session:', err);
    if (axios.isAxiosError(err) && err.response) {
      console.error('HesabPay API response:', err.response.data);
    }
    throw new HttpsError(
      'internal',
      'Failed to create payment session.',
      (err as Error).message
    );
  }
});


/**
 * Encrypts data using AES-256-CBC, matching the provided Python example.
 * @param data The string data to encrypt.
 * @param key The encryption key.
 * @returns The base64-encoded encrypted string (IV + ciphertext).
 */
function encryptPin(data: string, key: string): string {
  // Ensure the key is 32 bytes for AES-256
  let keyBytes = Buffer.from(key, 'utf-8');
  if (keyBytes.length < 32) {
    keyBytes = Buffer.concat([keyBytes], 32);
  } else if (keyBytes.length > 32) {
    keyBytes = keyBytes.slice(0, 32);
  }

  const iv = crypto.randomBytes(16); // Generate a random 16-byte IV
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBytes, iv);
  
  const paddedData = Buffer.from(data, 'utf-8');
  let encrypted = cipher.update(paddedData);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // Prepend the IV to the ciphertext and base64 encode
  const result = Buffer.concat([iv, encrypted]).toString('base64');
  return result;
}


/**
 * Distributes payment to multiple vendors after a successful transaction.
 */
export const distributePaymentToVendors = onCall(async (request) => {
    const { vendors } = request.data;
  
    if (!vendors || !Array.isArray(vendors) || vendors.length === 0) {
      throw new HttpsError('invalid-argument', 'The function must be called with a non-empty "vendors" array.');
    }
  
    const apiKey = hesabpayApiKey.value();
    const pin = merchantPin.value();
    const sandboxUrl = hesabpaySandboxUrl.value();
    const endpoint = `${sandboxUrl}/payment/send-money-MultiVendor`;

    const encryptedPin = encryptPin(pin, apiKey);

    const headers = {
        'Authorization': `API-KEY ${apiKey}`,
        'accept': 'application/json',
        'Content-Type': 'application/json',
    };

    const payload = {
        pin: encryptedPin,
        vendors,
    };

    try {
        const response = await axios.post(endpoint, payload, { headers });
        const txnId = uuidv4();

        const distributionData = {
            txnId,
            vendors,
            status: 'completed',
            response: response.data,
            createdAt: new Date().toISOString(),
        };

        await db.collection('payments').doc('distributions').collection(txnId).doc(txnId).set(distributionData);

        return { success: true, transactionId: txnId, summary: response.data };
    } catch (err) {
        console.error('Error distributing payment to vendors:', err);
        if (axios.isAxiosError(err) && err.response) {
            console.error('HesabPay API response:', err.response.data);
        }
        throw new HttpsError(
            'internal',
            'Failed to distribute payment.',
            (err as Error).message
        );
    }
});
