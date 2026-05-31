"use client"

import { AppShell } from "@/components/AppShell"
import { Users, ArrowLeft, Save, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createCustomer } from "./actions"

export default function NewCustomerPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    try {
      const result = await createCustomer(formData)
      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <AppShell>
      <div className="bg-gray-50 min-h-full p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <header className="flex flex-col gap-3">
            <Link href="/customers" className="text-gray-500 hover:text-indigo-600 flex items-center gap-2 text-sm w-fit transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Customers
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                </div>
                New Customer
              </h1>
              <p className="text-sm text-gray-600 font-medium mt-1">Add a new client to your system.</p>
            </div>
          </header>

          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <form action={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
                  <p>{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Full Name *</label>
                  <input 
                    type="text" 
                    name="full_name"
                    required
                    placeholder="e.g. Robert Taylor" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Mobile Number *</label>
                  <input 
                    type="tel" 
                    name="mobile_number"
                    required
                    placeholder="e.g. +1 234 567 8900" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Address</label>
                <input 
                  type="text" 
                  name="address"
                  placeholder="e.g. 123 Main St, City, Country" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Notes</label>
                <textarea 
                  name="notes"
                  rows={4}
                  placeholder="Any specific preferences or details..." 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none font-medium"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
                <Link href="/customers" className="px-6 py-3 rounded-xl font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                  Cancel
                </Link>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {isLoading ? "Saving..." : "Save Customer"}
                </button>
              </div>

            </form>
          </div>
          
        </div>
      </div>
    </AppShell>
  )
}
