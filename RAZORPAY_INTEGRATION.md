# Razorpay Integration Guide

## Overview
This guide explains how Razorpay has been integrated into your EcoFinds e-commerce application.

## Backend Integration

### 1. Configuration
- **File**: `Backend/config/razorpay.js`
- **Purpose**: Razorpay SDK configuration
- **Environment Variables Required**:
  - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
  - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret
  - `RAZORPAY_WEBHOOK_SECRET`: Your Razorpay Webhook Secret

### 2. Database Changes
- **File**: `Backend/models/order.model.js`
- **Change**: Added "razorpay" to paymentMethod enum
- **Values**: `["cod", "stripe", "razorpay"]`

### 3. Order Controller
- **File**: `Backend/controllers/order.controller.js`
- **New Functions**:
  - Razorpay order creation in `createNewOrder`
  - `razorpayWebhook`: Handles Razorpay webhooks
  - `verifyRazorpayPayment`: Verifies payment signatures

### 4. Routes
- **File**: `Backend/routes/order.routes.js`
- **New Routes**:
  - `POST /api/v1/razorpay/webhook`: Webhook endpoint
  - `POST /api/v1/razorpay/verify`: Payment verification

## Frontend Integration

### 1. Razorpay Payment Component
- **File**: `Frontend/src/components/Payment/RazorpayPayment.jsx`
- **Features**:
  - Dynamic script loading
  - Payment processing
  - Error handling
  - Success callbacks

### 2. Updated Payment Page
- **File**: `Frontend/src/components/Cart/PaymentPage.jsx`
- **Changes**:
  - Added Razorpay as payment option
  - Integrated RazorpayPayment component
  - Updated payment method selection UI

## Environment Variables Setup

Add these to your `.env` file in the Backend directory:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

## Payment Flow

### 1. Order Creation
1. User selects Razorpay as payment method
2. Frontend calls `createNewOrder` with `paymentMethod: "razorpay"`
3. Backend creates Razorpay order and returns order details
4. Frontend displays Razorpay payment modal

### 2. Payment Processing
1. User completes payment on Razorpay modal
2. Razorpay returns payment response
3. Frontend calls `/razorpay/verify` endpoint
4. Backend verifies payment signature
5. Order status updated to "completed"

### 3. Webhook Handling
1. Razorpay sends webhook to `/razorpay/webhook`
2. Backend verifies webhook signature
3. Order payment status updated

## Testing

### Test Mode
- Use Razorpay test credentials
- Test cards: 4111 1111 1111 1111
- Test UPI: any UPI ID
- Test wallets: any test wallet

### Production Mode
- Replace test credentials with live credentials
- Update webhook URLs in Razorpay dashboard
- Test with real payment methods

## Security Features

1. **Signature Verification**: All payments are verified using HMAC signatures
2. **Webhook Security**: Webhook signatures are validated
3. **Order Validation**: Orders are validated before payment processing
4. **Error Handling**: Comprehensive error handling throughout the flow

## Usage in Components

```jsx
import PaymentPage from './components/Cart/PaymentPage';

// In your checkout component
<PaymentPage
  orderData={orderData}
  onPaymentSuccess={(order) => {
    // Handle successful payment
    console.log('Payment successful:', order);
  }}
  onPaymentError={(error) => {
    // Handle payment error
    console.error('Payment failed:', error);
  }}
/>
```

## Troubleshooting

### Common Issues
1. **Script Loading**: Ensure Razorpay script loads correctly
2. **Signature Mismatch**: Check key secrets and signature generation
3. **Webhook Issues**: Verify webhook URL and secret
4. **Order Not Found**: Ensure order exists before payment verification

### Debug Steps
1. Check browser console for JavaScript errors
2. Verify network requests in browser dev tools
3. Check backend logs for error messages
4. Validate environment variables

## Support

For Razorpay-specific issues:
- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: support@razorpay.com

For integration issues:
- Check the application logs
- Verify all environment variables
- Test with Razorpay test credentials first
