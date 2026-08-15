import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { paymentService } from '../../services';

type State = 'verifying' | 'success' | 'pending' | 'failed';

/**
 * Where Paystack returns the guest after checkout. The redirect itself proves
 * nothing, so we ask our backend to verify the transaction before showing any
 * confirmation. (The webhook is the authoritative signal and may well have
 * settled it already — verifying is idempotent.)
 */
const PaymentCallbackPage: React.FC = () => {
  const [params] = useSearchParams();
  // Paystack appends ?reference= (and trxref=) to the callback URL.
  const reference = params.get('reference') ?? params.get('trxref') ?? '';
  const [state, setState] = useState<State>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!reference) {
      setState('failed');
      setMessage('No payment reference was provided.');
      return;
    }
    let active = true;
    paymentService.verify(reference)
      .then((res) => {
        if (!active) return;
        if (res.status === 'success') { setState('success'); setMessage(res.message); }
        else if (res.status === 'pending') { setState('pending'); setMessage(res.message); }
        else { setState('failed'); setMessage(res.message || 'The payment did not go through.'); }
      })
      .catch((err) => {
        if (!active) return;
        setState('failed');
        setMessage(err?.response?.data?.message ?? 'We could not confirm this payment.');
      });
    return () => { active = false; };
  }, [reference]);

  const view = {
    verifying: {
      icon: <Loader2 className="h-12 w-12 text-primary-500 animate-spin" />,
      bg: 'bg-primary-50',
      title: 'Confirming your payment…',
      body: 'Hold on a moment while we check with the payment provider.',
    },
    success: {
      icon: <CheckCircle className="h-12 w-12 text-emerald-500" />,
      bg: 'bg-emerald-50',
      title: 'Payment confirmed',
      body: 'Your booking is confirmed. Show your booking reference at the front desk to check in.',
    },
    pending: {
      icon: <Loader2 className="h-12 w-12 text-amber-500" />,
      bg: 'bg-amber-50',
      title: 'Payment still processing',
      body: 'Your bank has not completed this yet. We will confirm your booking automatically once it clears.',
    },
    failed: {
      icon: <AlertCircle className="h-12 w-12 text-red-500" />,
      bg: 'bg-red-50',
      title: 'Payment not completed',
      body: message || 'The payment did not go through. Your room is still held — you can try again.',
    },
  }[state];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center"
      >
        <div className={`inline-flex p-5 ${view.bg} rounded-full mb-6`}>{view.icon}</div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">{view.title}</h2>
        <p className="text-gray-500 text-sm mb-6">{view.body}</p>

        {reference && state !== 'verifying' && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-8">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Payment reference</p>
            <p className="text-sm font-mono font-semibold text-gray-800 break-all">{reference}</p>
          </div>
        )}

        {state !== 'verifying' && (
          <Link to="/" className="btn-accent w-full py-3 inline-block">Done</Link>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentCallbackPage;
