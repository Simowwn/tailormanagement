"use client"

import { useState, useRef } from "react"
import { Save, AlertCircle } from "lucide-react"
import { recordPayment } from "../actions"
import Link from "next/link"

type Order = {
  id: string
  garment_type: string
  total_amount: number
  customers: { full_name: string } | null
}

export default function PaymentForm({ orders }: { orders: Order[] }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isSubmitting = useRef(false)

  async function handleSubmit(formData: FormData) {
    if (isSubmitting.current) return
    isSubmitting.current = true
    setIsLoading(true)
    setError(null)
    const result = await recordPayment(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
      isSubmitting.current = false
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
      <form action={handleSubmit} className="space-y-8">

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
            <p>{error}</p>
          </div>
        )}

        {/* ORDER */}
        <section className="space-y-4">
          <div className="border-b border-gray-200 pb-2">
            <h2 className="text-xl font-bold text-gray-900">1. Select Order</h2>
            <p className="text-sm text-gray-500 font-medium">Choose which order this payment is for.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Order *</label>
            <select
              name="order_id"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
            >
              <option value="">— Select an order —</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.customers?.full_name} — {order.garment_type} (₱{order.total_amount})
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* PAYMENT DETAILS */}
        <section className="space-y-4">
          <div className="border-b border-gray-200 pb-2">
            <h2 className="text-xl font-bold text-gray-900">2. Payment Details</h2>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Payment Type</label>
            <div className="flex gap-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
              {["Downpayment", "Full Payment", "Installment"].map((type) => (
                <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="radio"
                    name="payment_type"
                    value={type}
                    defaultChecked={type === "Downpayment"}
                    className="w-4 h-4 text-indigo-600 bg-white border-gray-300 focus:ring-indigo-500 focus:ring-2"
                  />
                  <span className="text-sm font-bold text-gray-600 group-hover:text-indigo-600 transition-colors">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Amount (₱) *</label>
              <input
                type="number"
                name="amount"
                required
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Payment Date</label>
              <input
                type="date"
                name="payment_date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
              />
            </div>
          </div>
        </section>

        {/* NOTES */}
        <section className="space-y-4">
          <div className="border-b border-gray-200 pb-2">
            <h2 className="text-xl font-bold text-gray-900">3. Notes <span className="text-base font-normal text-gray-400">(Optional)</span></h2>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Notes</label>
            <textarea
              name="notes"
              rows={3}
              placeholder="e.g. Paid via GCash, receipt #1234..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 resize-none font-medium"
            />
          </div>
        </section>

        {/* ACTIONS */}
        <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
          <Link
            href="/payments"
            className="px-6 py-3 rounded-xl font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isLoading ? "Saving..." : "Save Payment"}
          </button>
        </div>

      </form>
    </div>
  )
}
