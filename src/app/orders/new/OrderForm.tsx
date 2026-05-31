"use client"

import { useState } from "react"
import { Scissors, Users, AlertCircle, Save } from "lucide-react"
import { createCombinedOrder } from "./actions"
import Link from "next/link"

export default function OrderForm({ customers }: { customers: any[] }) {
  const [isNewCustomer, setIsNewCustomer] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    formData.append("is_new_customer", isNewCustomer ? "true" : "false")
    
    const result = await createCombinedOrder(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <form action={handleSubmit} className="space-y-10">
        
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
            <p>{error}</p>
          </div>
        )}

        {/* CUSTOMER SECTION */}
        <section className="space-y-4">
          <div className="border-b border-gray-200 pb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">1. Customer Details</h2>
              <p className="text-sm text-gray-500 font-medium">Select an existing customer or add a new one.</p>
            </div>
            <div className="grid grid-cols-2 md:flex bg-gray-100 p-1 rounded-xl w-full md:w-auto gap-1 md:gap-0">
              <button
                type="button"
                onClick={() => setIsNewCustomer(true)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap text-center ${
                  isNewCustomer ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                New Customer
              </button>
              <button
                type="button"
                onClick={() => setIsNewCustomer(false)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap text-center ${
                  !isNewCustomer ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Existing
              </button>
            </div>
          </div>

          {!isNewCustomer ? (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Select Customer *</label>
              <select name="existing_customer_id" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium">
                <option value="">-- Choose a customer --</option>
                {customers.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.full_name} ({c.mobile_number})</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Full Name *</label>
                <input type="text" name="full_name" required placeholder="e.g. Robert Taylor" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Mobile Number *</label>
                <input type="tel" name="mobile_number" required placeholder="e.g. +1 234 567 8900" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Address</label>
                <input type="text" name="address" placeholder="e.g. 123 Main St" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
              </div>
            </div>
          )}
        </section>

        {/* MEASUREMENTS SECTION */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-900">2. Measurements (Optional)</h2>
            <p className="text-sm text-slate-500 font-medium">Save new measurements for this customer.</p>
          </div>
          
          <div className="space-y-6 bg-slate-50/50 rounded-2xl border border-slate-100 p-6">
            
            {/* Top / Shirt */}
            <div>
              <h3 className="text-sm font-bold text-indigo-600 mb-4 uppercase tracking-wider">Top / Shirt</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Neck", name: "neck" },
                  { label: "Chest", name: "chest" },
                  { label: "Shoulder", name: "shoulder" },
                  { label: "Sleeve Length", name: "sleeve_length" },
                  { label: "Shirt Length", name: "shirt_length" },
                ].map(field => (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1">{field.label}</label>
                    <input type="number" step="0.1" name={field.name} placeholder="in/cm" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom / Pants */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-sm font-bold text-emerald-600 mb-4 uppercase tracking-wider">Bottom / Pants</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Waist", name: "waist" },
                  { label: "Hips", name: "hips" },
                  { label: "Inseam", name: "inseam" },
                ].map(field => (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1">{field.label}</label>
                    <input type="number" step="0.1" name={field.name} placeholder="in/cm" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ORDER SECTION */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-900">3. Order Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Garment Type *</label>
              <input type="text" name="garment_type" required placeholder="e.g. Wedding Suit, 3 Shirts" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Due Date</label>
              <input type="date" name="due_date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Total Amount (₱) *</label>
              <input type="number" name="total_amount" id="total_amount" required min="0" step="0.01" placeholder="0.00" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Description / Notes</label>
              <textarea name="description" rows={3} placeholder="Fabric details, style preferences..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 resize-none font-medium" />
            </div>
          </div>
        </section>

        {/* PAYMENT SECTION */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-900">4. Initial Payment (Optional)</h2>
            <p className="text-sm text-slate-500 font-medium">Record an upfront payment for this order.</p>
          </div>
          <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 space-y-5">
            <div className="flex gap-6">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input type="radio" name="payment_type" value="Downpayment" defaultChecked className="w-4 h-4 text-indigo-600 bg-white border-slate-300 focus:ring-indigo-500 focus:ring-2" />
                <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Downpayment</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input type="radio" name="payment_type" value="Full Payment" className="w-4 h-4 text-indigo-600 bg-white border-slate-300 focus:ring-indigo-500 focus:ring-2" 
                  onChange={(e) => {
                    if (e.target.checked) {
                      const totalInput = document.getElementById('total_amount') as HTMLInputElement;
                      const paymentInput = document.getElementById('initial_payment') as HTMLInputElement;
                      if (totalInput && paymentInput && totalInput.value) {
                        paymentInput.value = totalInput.value;
                      }
                    }
                  }}
                />
                <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Full Payment</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Payment Amount (₱)</label>
                <input type="number" id="initial_payment" name="initial_payment" min="0" step="0.01" placeholder="0.00" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
              </div>
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-slate-200 flex justify-end gap-4">
          <Link href="/orders" className="px-6 py-3 rounded-xl font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isLoading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isLoading ? "Saving..." : "Create Order"}
          </button>
        </div>

      </form>
    </div>
  )
}
