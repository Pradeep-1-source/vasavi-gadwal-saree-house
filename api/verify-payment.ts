import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

// Vercel Serverless Function to Securely Verify Razorpay Signatures
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // If running in test mode simulator without credentials
  if (!keySecret) {
    if (razorpay_payment_id && razorpay_payment_id.startsWith('pay_sim_')) {
      return res.status(200).json({
        verified: true,
        testMode: true,
        message: 'Payment simulated successfully in developer test mode.',
      });
    }
  }

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment signature verification parameters' });
  }

  if (!keySecret) {
    return res.status(500).json({ error: 'RAZORPAY_KEY_SECRET is not configured on the server' });
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      return res.status(200).json({ verified: true, paymentId: razorpay_payment_id });
    } else {
      return res.status(400).json({ verified: false, error: 'Invalid payment signature' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Signature verification error' });
  }
}
