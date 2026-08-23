import { useState } from 'react'
import { ShieldCheck, Lock } from 'lucide-react'

interface PaymentUIProps {
  appointmentId: string
  consultationFee: number // in Rupees
  doctorName: string
  patientPhone: string
  patientName: string
  onPaymentSuccess: (paymentId: string, transactionId: string) => void
  onPaymentError: (errorMsg: string) => void
}

export default function PaymentUI({
  appointmentId,
  consultationFee,
  doctorName,
  patientPhone,
  patientName,
  onPaymentSuccess,
  onPaymentError
}: PaymentUIProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi')

  const handleRazorpayPayment = async () => {
    setIsProcessing(true)

    try {
      // Simulate Razorpay Gateway Transaction
      setTimeout(() => {
        const mockPaymentId = `pay_rzp_${Date.now().toString().slice(-8)}`
        const mockTxnId = `txn_${Math.random().toString(36).substring(2, 10)}`

        // Log payment in local storage audit
        const existingPayments = JSON.parse(localStorage.getItem('clinicos_payments') || '[]')
        const newPayment = {
          id: mockPaymentId,
          appointment_id: appointmentId,
          amount: consultationFee * 100, // in paisa
          amount_in_rupees: consultationFee,
          doctor_name: doctorName,
          patient_name: patientName,
          patient_phone: patientPhone,
          gateway_provider: 'razorpay',
          gateway_transaction_id: mockTxnId,
          status: 'paid',
          payment_method: paymentMethod,
          timestamp: new Date().toLocaleString()
        }
        existingPayments.unshift(newPayment)
        localStorage.setItem('clinicos_payments', JSON.stringify(existingPayments))

        setIsProcessing(false)
        onPaymentSuccess(mockPaymentId, mockTxnId)
      }, 1500)
    } catch (err: any) {
      setIsProcessing(false)
      onPaymentError(err.message || 'Razorpay payment processing failed')
    }
  }

  return (
    <div className="bg-white border-2 border-blue-600 rounded-3xl p-6 shadow-xl space-y-5 text-slate-800 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider rounded-full border border-blue-100">
            Secure Payment Required
          </span>
          <h3 className="text-lg font-black text-slate-900 font-recoleta mt-1">Consultation Fee Payment</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 font-medium">Fee Amount</p>
          <p className="text-2xl font-black text-emerald-600 font-mono">₹{consultationFee}</p>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
        <p className="text-slate-500 font-medium">Doctor: <strong className="text-slate-900">{doctorName}</strong></p>
        <p className="text-slate-500 font-medium">Patient: <strong className="text-slate-900">{patientName} (+91-{patientPhone})</strong></p>
      </div>

      {/* Payment Method Selector */}
      <div className="space-y-2">
        <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Select Payment Method</label>
        <div className="grid grid-cols-3 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`p-3 rounded-xl border text-center transition ${
              paymentMethod === 'upi'
                ? 'bg-blue-600 text-white border-blue-600 shadow'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            📱 UPI / GPay
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-3 rounded-xl border text-center transition ${
              paymentMethod === 'card'
                ? 'bg-blue-600 text-white border-blue-600 shadow'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            💳 Debit / Credit
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('netbanking')}
            className={`p-3 rounded-xl border text-center transition ${
              paymentMethod === 'netbanking'
                ? 'bg-blue-600 text-white border-blue-600 shadow'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            🏦 Net Banking
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={isProcessing}
        onClick={handleRazorpayPayment}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing Razorpay Payment...</span>
          </>
        ) : (
          <>
            <Lock size={16} /> Pay ₹{consultationFee} & Generate Visit Token
          </>
        )}
      </button>

      <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>128-bit Encrypted Razorpay Gateway • 100% Refundable if cancelled</span>
      </p>
    </div>
  )
}
