import React, { useEffect, useState } from 'react';
import { useEcommerce } from '../../contexts/EcommerceContext';
import { useCreateNewOrderMutation } from '../../store/api/orderApi';

const RazorpayPayment = ({ orderData, onPaymentSuccess, onPaymentError }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [createNewOrder] = useCreateNewOrderMutation();
    const { clearCart } = useEcommerce();

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const displayRazorpay = async (razorpayOrder) => {
        const res = await loadRazorpayScript();
        if (!res) {
            onPaymentError('Razorpay SDK failed to load. Are you online?');
            return;
        }

        const options = {
            key: razorpayOrder.key,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: 'EcoFinds',
            description: 'Payment for your order',
            order_id: razorpayOrder.id,
            handler: async function (response) {
                try {
                    setIsLoading(true);
                    
                    // Verify payment on backend
                    const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/razorpay/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    const verifyData = await verifyResponse.json();

                    if (verifyData.success) {
                        clearCart();
                        onPaymentSuccess(verifyData.data);
                    } else {
                        onPaymentError(verifyData.message || 'Payment verification failed');
                    }
                } catch (error) {
                    console.error('Payment verification error:', error);
                    onPaymentError('Payment verification failed. Please contact support.');
                } finally {
                    setIsLoading(false);
                }
            },
            prefill: {
                name: orderData.shippingInfo?.name || '',
                email: orderData.shippingInfo?.email || '',
                contact: orderData.shippingInfo?.phoneNo || '',
            },
            notes: {
                address: orderData.shippingInfo?.address || '',
            },
            theme: {
                color: '#2563eb',
            },
            modal: {
                ondismiss: () => {
                    setIsLoading(false);
                },
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const handleRazorpayPayment = async () => {
        try {
            setIsLoading(true);
            
            // Create order with Razorpay payment method
            const orderPayload = {
                ...orderData,
                paymentMethod: 'razorpay',
            };

            const response = await createNewOrder(orderPayload).unwrap();

            if (response.success && response.razorpayOrder) {
                await displayRazorpay(response.razorpayOrder);
            } else {
                onPaymentError(response.message || 'Failed to create order');
            }
        } catch (error) {
            console.error('Order creation error:', error);
            onPaymentError(error.data?.message || 'Failed to create order');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <button
                onClick={handleRazorpayPayment}
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                    </div>
                ) : (
                    'Pay with Razorpay'
                )}
            </button>
            
            <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <img 
                        src="https://razorpay.com/assets/razorpay-logo.svg" 
                        alt="Razorpay" 
                        className="h-4"
                    />
                    <span>Secure payments powered by Razorpay</span>
                </div>
            </div>
        </div>
    );
};

export default RazorpayPayment;
