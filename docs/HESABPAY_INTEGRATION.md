# HesabPay Integration Guide

This document describes the HesabPay payment integration for AfgAiHub.

## Overview

The integration provides:
1. Payment session creation via Firebase Cloud Function
2. Secure webhook handling for payment updates
3. Multi-vendor payment distribution
4. Automatic subscription grants on successful payments
5. Support for guest and authenticated payments

## Environment Variables

Set the following environment variables in Firebase:

### Required Secrets (use Firebase Secret Manager)
```bash
# HesabPay API Key (Secret)
firebase functions:secrets:set HESABPAY_KEY

# Webhook Secret for verifying HesabPay callbacks (Secret)
firebase functions:secrets:set HESABPAY_WEBHOOK_SECRET

# Merchant PIN for payment distribution (Secret)
firebase functions:secrets:set MERCHANT_PIN
```

### Required Configuration
```bash
# Base URL for HesabPay API (defaults to production)
firebase functions:config:set hesabpay.base_url="https://api.hesab.com/api/v1"

# For sandbox testing, use:
# firebase functions:config:set hesabpay.base_url="https://sandbox-api.hesab.com/api/v1"
```

## Architecture

### Cloud Functions

#### 1. createPaymentSession
**Endpoint:** `createPaymentSession` (Callable Function)  
**Purpose:** Creates a payment session with HesabPay  
**Authentication:** Optional (supports guest payments)

**Request:**
```typescript
{
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity?: number;
  }>;
  email?: string;
  successUrl: string;
  failUrl: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  checkout_url: string;
  sessionId: string;
}
```

**Firestore Collections:**
- Creates document in `payment_sessions/{sessionId}`
- Logs errors to `payment_errors`

#### 2. hesabWebhook
**Endpoint:** `hesabWebhook` (HTTP Function)  
**Purpose:** Receives and processes payment updates from HesabPay  
**Authentication:** HMAC SHA256 signature verification

**Security:**
- Validates webhook signature using local HMAC SHA256
- Rejects requests without valid signature
- Idempotent transaction updates

**Features:**
- Updates payment transaction status
- Grants user subscriptions on successful payment
- Updates session status
- Stores transaction details

**Webhook Payload:**
```typescript
{
  transaction_id: string;
  session_id?: string;
  success: boolean;
  amount?: number;
  email?: string;
  user_id?: string;
}
```

**Firestore Collections:**
- Updates `payment_transactions/{transactionId}`
- Updates `payment_sessions/{sessionId}` if session_id provided
- Updates `users/{userId}` with subscription info on success

#### 3. distributePayment
**Endpoint:** `distributePayment` (Callable Function)  
**Purpose:** Distributes payments to multiple vendors  
**Authentication:** Required

**Request:**
```typescript
{
  vendors: Array<{
    account_number: string;
    amount: number;
    description?: string;
  }>; // Max 16 vendors
}
```

**Response:**
```typescript
{
  success: boolean;
  transactionId: string;
  summary: any; // HesabPay response
}
```

**Validation:**
- 1-16 vendors maximum
- No duplicate account numbers
- Encrypts PIN using AES-256-CBC

**Firestore Collections:**
- Creates document in `payment_distributions/{txnId}`

## Client-Side Integration

### Using the Payment Hook

```typescript
import { usePayment } from '@/hooks/usePayment';

function MyComponent() {
  const { createPaymentSession, error } = usePayment();

  const handlePayment = async () => {
    await createPaymentSession({
      items: [
        {
          id: 'premium-sub-1',
          name: 'Premium Subscription',
          price: 29.99,
          quantity: 1,
        }
      ],
      email: 'user@example.com', // Optional for authenticated users
    });
    // User will be redirected to HesabPay checkout
  };

  return (
    <button onClick={handlePayment}>
      Pay Now
    </button>
  );
}
```

### Payment Flow

1. User clicks payment button
2. `createPaymentSession` is called
3. User is redirected to HesabPay checkout URL
4. User completes payment at HesabPay
5. HesabPay redirects to success/failure URL
6. HesabPay sends webhook to `hesabWebhook`
7. Webhook updates transaction and grants subscription
8. Success/Fail page displays result

### Post-Payment Event Handling

The success and failure pages listen for `postMessage` events from HesabPay:

```typescript
// Allowed origins (validated)
const allowedOrigins = [
  'https://api.hesab.com',
  'https://hesab.com',
  'https://checkout.hesab.com',
];

// Success event
{
  type: 'paymentSuccess',
  payload: { transaction_id, ... }
}

// Failure event
{
  type: 'paymentFailure' | 'paymentCancelled',
  payload: { ... }
}
```

## Firestore Schema

### Collections

#### payment_sessions
```typescript
{
  sessionId: string;
  checkout_url: string;
  email: string | null;
  userId: string | null;
  guest: boolean;
  items: Array<Item>;
  status: 'pending' | 'success' | 'failed';
  transaction_id?: string; // Added by webhook
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
```

#### payment_transactions
```typescript
{
  transaction_id: string;
  session_id: string | null;
  status: 'success' | 'failed';
  amount: number | null;
  email: string | null;
  userId: string | null;
  webhookPayload: any;
  updatedAt: Timestamp;
}
```

#### payment_distributions
```typescript
{
  txnId: string;
  initiatorUserId: string;
  vendors: Array<Vendor>;
  status: 'completed' | 'failed';
  response?: any;
  error?: any;
  createdAt: Timestamp;
}
```

#### users (subscription fields)
```typescript
{
  subscription: {
    active: boolean;
    tier: string; // e.g., 'premium'
    activatedAt: Timestamp;
    transactionId: string;
  };
  // ... other user fields
}
```

## Security

### PIN Encryption (AES-256-CBC)
The merchant PIN is encrypted before sending to HesabPay:
```typescript
function encryptPin(pin: string, key: string): string {
  const secretKey = key.substring(0, 32).padEnd(32, '\0');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(pin, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return Buffer.from(iv.toString('hex') + encrypted, 'utf8').toString('base64');
}
```

### Webhook Verification
Local HMAC SHA256 signature verification:
```typescript
const hmac = crypto.createHmac('sha256', secret);
hmac.update(JSON.stringify(req.body));
const expectedSignature = hmac.digest('hex');

if (signature !== expectedSignature) {
  // Reject request
}
```

### Input Validation
- All function inputs are validated
- Array lengths checked (e.g., max 16 vendors)
- Duplicate account numbers rejected
- Required fields verified

### Idempotency
- Webhook handler uses Firestore transactions
- Only updates if status changes
- Prevents duplicate subscription grants

## Testing

### Sandbox Testing

1. Set sandbox base URL:
```bash
firebase functions:config:set hesabpay.base_url="https://sandbox-api.hesab.com/api/v1"
```

2. Use sandbox API keys for HESABPAY_KEY

3. Test payment flow with sandbox credentials

4. Verify webhook signature with sandbox secret

### Local Testing

1. Install Firebase emulators:
```bash
npm install -g firebase-tools
```

2. Start emulators:
```bash
cd functions
npm run serve
```

3. Test callable functions:
```bash
# Use Firebase console or client SDK
```

4. Test webhook with curl:
```bash
curl -X POST http://localhost:5001/YOUR_PROJECT/us-central1/hesabWebhook \
  -H "Content-Type: application/json" \
  -H "x-hesab-signature: YOUR_SIGNATURE" \
  -d '{"transaction_id":"test123","success":true}'
```

## Deployment

1. Deploy functions:
```bash
firebase deploy --only functions
```

2. Deploy Firestore rules:
```bash
firebase deploy --only firestore:rules
```

3. Verify environment variables are set:
```bash
firebase functions:config:get
firebase functions:secrets:access HESABPAY_KEY
```

## Support

For issues with HesabPay integration:
1. Check Cloud Functions logs: `firebase functions:log`
2. Review `payment_errors` collection in Firestore
3. Verify webhook signatures are correct
4. Ensure environment variables are properly set

## References

- [HesabPay API Documentation](https://hesab.com/docs)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
