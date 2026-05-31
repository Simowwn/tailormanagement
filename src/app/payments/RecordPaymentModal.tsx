"use client"

import { useState, useRef } from "react"
import { X, CreditCard, AlertCircle, Save } from "lucide-react"
import { recordPayment } from "./actions"

type Order = {
  id: string
  garment_type: string
  total_amount: number
  customers: { full_name: string } | null
}

export default function RecordPaymentModal({ orders }: { orders: Order[] }) {
  const [isOpen, setIsOpen] = useState(false)
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
    } else {
      setIsOpen(false)
      setIsLoading(false)
      isSubmitting.current = false
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
      >
        <CreditCard className="w-5 h-5" />
        Record Payment
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Record Payment</h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Log a payment for an existing order.</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Order */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Order *</label>
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

          {/* Payment Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Payment Type</label>
            <div className="flex gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
              {["Downpayment", "Full Payment", "Installment"].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="payment_type"
                    value={type}
                    defaultChecked={type === "Downpayment"}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Amount (₱) *</label>
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

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Payment Date</label>
            <input
              type="date"
              name="payment_date"
              defaultValue={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              name="notes"
              rows={3}
              placeholder="e.g. Paid via GCash, receipt #1234..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 resize-none font-medium"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 rounded-xl font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Saving..." : "Save Payment"}
            </button>
          </div>

        </form>
      </div>
    </>
  )
}
