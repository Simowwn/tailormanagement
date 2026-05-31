"use client"

import { useState } from "react"
import { Users, AlertCircle, Save } from "lucide-react"
import { updateCustomer } from "./actions"
import Link from "next/link"

export default function EditCustomerForm({ customer, measurements }: { customer: any, measurements: any }) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await updateCustomer(customer.id, formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
      <form action={handleSubmit} className="space-y-10">
        
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
            <p>{error}</p>
          </div>
        )}

        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-900">1. Customer Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Full Name *</label>
              <input type="text" name="full_name" required defaultValue={customer.full_name} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Mobile Number *</label>
              <input type="tel" name="mobile_number" required defaultValue={customer.mobile_number} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Address</label>
              <input type="text" name="address" defaultValue={customer.address || ''} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-900">2. Measurements</h2>
          </div>
          
          <div className="space-y-6 bg-slate-50/50 rounded-2xl border border-slate-100 p-6">
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
                    <input type="number" step="0.1" name={field.name} defaultValue={measurements?.[field.name] || ''} placeholder="in/cm" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
                  </div>
                ))}
              </div>
            </div>

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
                    <input type="number" step="0.1" name={field.name} defaultValue={measurements?.[field.name] || ''} placeholder="in/cm" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-slate-200 flex justify-end gap-4">
          <Link href="/customers" className="px-6 py-3 rounded-xl font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isLoading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  )
}
