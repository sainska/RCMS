const axios = require('axios');

const MPESA_BASE_URL = process.env.MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke';
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const SHORT_CODE = process.env.MPESA_SHORT_CODE; // e.g., 174379 (sandbox paybill)
const PASSKEY = process.env.MPESA_PASSKEY; // Lipa Na Mpesa Online passkey
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://example.com/api/payments/mpesa/callback';

function getTimestamp() {
  const now = new Date();
  const yyyy = now.getFullYear().toString();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}${MM}${dd}${hh}${mm}${ss}`;
}

async function getAccessToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  const url = `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;
  const res = await axios.get(url, {
    headers: { Authorization: `Basic ${auth}` },
    timeout: 10000,
  });
  return res.data.access_token;
}

async function initiateStkPush({ amount, phoneNumber, accountReference = 'RCMS', transactionDesc = 'RCMS Payment' }) {
  const accessToken = await getAccessToken();
  const timestamp = getTimestamp();
  const password = Buffer.from(`${SHORT_CODE}${PASSKEY}${timestamp}`).toString('base64');

  const payload = {
    BusinessShortCode: SHORT_CODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: SHORT_CODE,
    PhoneNumber: phoneNumber,
    CallBackURL: CALLBACK_URL,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc,
  };

  const res = await axios.post(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
    timeout: 15000,
  });

  return res.data; // contains MerchantRequestID, CheckoutRequestID, ResponseCode, etc.
}

module.exports = {
  initiateStkPush,
};


