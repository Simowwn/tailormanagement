"use client"

import { useState } from "react"
import { CreditCard, AlertCircle, Save } from "lucide-react"
import { updatePayment } from "./actions"
import Link from "next/link"

export default function EditPaymentForm({ payment }: { payment: any }) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await updatePayment(payment.id, formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
      <form action={handleSubmit} className="space-y-8">
        
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Payment Type *</label>
            <select name="payment_type" required defaultValue={payment.payment_type} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium">
              <option value="Downpayment">Downpayment</option>
              <option value="Full Payment">Full Payment</option>
              <option value="Installment">Installment</option>
            </select>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Amount (₱) *</label>
            <input type="number" name="amount" required min="0" step="0.01" defaultValue={payment.amount} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium" />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Description / Notes</label>
            <textarea name="notes" rows={3} defaultValue={payment.notes || ''} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 resize-none font-medium" />
          </div>
          
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-end gap-4">
          <Link href="/payments" className="px-6 py-3 rounded-xl font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isLoading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  )
}
