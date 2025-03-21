import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { FaCrown, FaCheck, FaRegStar, FaStar } from 'react-icons/fa';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Subscription plan options
const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 9.99,
    interval: 'month',
    description: 'Perfect for trying out all premium features',
    features: [
      'Full access to all 5 pillars',
      'Unlimited activities and challenges',
      'Progress tracking for multiple children',
      'Printable certificates',
      'Rewards marketplace',
      'Social sharing capabilities'
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 89.99,
    regularPrice: 119.88, // 12 * 9.99
    interval: 'year',
    description: 'Our most popular plan',
    features: [
      'Full access to all 5 pillars',
      'Unlimited activities and challenges',
      'Progress tracking for multiple children',
      'Printable certificates',
      'Rewards marketplace',
      'Social sharing capabilities',
      'Priority support',
      'Early access to new features'
    ],
    bestValue: true
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: 249.99,
    interval: 'once',
    description: 'Pay once, use forever',
    features: [
      'Full access to all 5 pillars',
      'Unlimited activities and challenges',
      'Progress tracking for multiple children',
      'Printable certificates',
      'Rewards marketplace',
      'Social sharing capabilities',
      'Priority support',
      'Early access to new features',
      'All future updates included'
    ]
  }
];

// CheckoutForm component for handling payment submission
const CheckoutForm = ({ selectedPlan, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get a reference to the card element
      const cardElement = elements.getElement(CardElement);

      // Create a payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Send the payment method ID to your server
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/subscriptions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          planId: selectedPlan.id,
          customerId: currentUser.id,
          email: currentUser.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process subscription');
      }

      // Handle subscription status
      if (data.status === 'success') {
        onSuccess(data);
      } else if (data.status === 'requires_action') {
        // Handle 3D Secure authentication if required
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          data.clientSecret
        );

        if (confirmError) {
          throw new Error(confirmError.message);
        } else if (paymentIntent.status === 'succeeded') {
          onSuccess(data);
        } else {
          throw new Error('Payment failed');
        }
      } else {
        throw new Error(data.message || 'Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError(error.message);
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card-element-container">
        <CardElement options={cardElementOptions} />
      </div>
      
      {error && (
        <div className="alert alert-danger mb-3">
          {error}
        </div>
      )}
      
      <button 
        type="submit" 
        className="subscribe-button"
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : `Subscribe for $${selectedPlan.price}/${selectedPlan.interval === 'once' ? '' : selectedPlan.interval}`}
      </button>
    </form>
  );
};

// Main Subscription component
const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(plans[1]); // Default to yearly plan
  const [subscriptionComplete, setSubscriptionComplete] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(null);
  const { currentUser, userSubscription, fetchSubscriptionStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user already has an active subscription, redirect to dashboard
    if (userSubscription && userSubscription.status === 'active') {
      navigate('/dashboard');
    }
  }, [userSubscription, navigate]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSubscriptionSuccess = async (data) => {
    setSubscriptionComplete(true);
    // Refresh subscription status
    await fetchSubscriptionStatus();
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  const handleSubscriptionError = (errorMessage) => {
    setSubscriptionError(errorMessage);
  };

  if (subscriptionComplete) {
    return (
      <div className="subscription-page">
        <div className="success-message">
          <h2><FaCheck className="me-2" /> Subscription Successful!</h2>
          <p>Thank you for subscribing to Confident Kids Premium. You now have access to all premium features.</p>
          <p>You will be redirected to your dashboard shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-page">
      <div className="feature-highlight">
        <h1><FaCrown className="me-2" /> Upgrade to Confident Kids Premium</h1>
        <p>Unlock the full potential of your child's confidence journey with our premium features.</p>
      </div>
      
      <div className="plan-selection">
        <h2>Choose Your Plan</h2>
        <div className="plan-options">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`plan-card ${selectedPlan.id === plan.id ? 'selected' : ''}`}
              onClick={() => handlePlanSelect(plan)}
            >
              {plan.bestValue && <div className="best-value">Best Value</div>}
              <h3>{plan.name}</h3>
              <div className="price">
                ${plan.price} <span>/{plan.interval === 'once' ? '' : plan.interval}</span>
              </div>
              {plan.regularPrice && (
                <div className="savings">
                  Save ${(plan.regularPrice - plan.price).toFixed(2)} per year
                </div>
              )}
              <p>{plan.description}</p>
              <ul className="features">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button 
                className={`btn ${selectedPlan.id === plan.id ? 'btn-primary' : 'btn-outline'} w-100`}
              >
                {selectedPlan.id === plan.id ? 'Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="payment-section">
        <h2>Payment Information</h2>
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            selectedPlan={selectedPlan} 
            onSuccess={handleSubscriptionSuccess}
            onError={handleSubscriptionError}
          />
        </Elements>
        
        {subscriptionError && (
          <div className="alert alert-danger mt-3">
            {subscriptionError}
          </div>
        )}
        
        <div className="guarantee">
          <p><FaRegStar /> 30-day money-back guarantee <FaRegStar /></p>
          <p>If you're not satisfied with our premium features, we'll refund your payment within the first 30 days.</p>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
