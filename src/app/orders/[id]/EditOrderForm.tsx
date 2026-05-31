"use client"

import { useState } from "react"
import { Scissors, AlertCircle, Save } from "lucide-react"
import { updateOrder } from "./actions"
import Link from "next/link"

export default function EditOrderForm({ order }: { order: any }) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await updateOrder(order.id, formData)
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
            <label className="text-sm font-semibold text-slate-700 ml-1">Order Status *</label>
            <select name="status" required defaultValue={order.status} className="w-full px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 font-bold">
              <option value="Pending">Pending (Not Started)</option>
              <option value="In Progress">In Progress (Sewing)</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Garment Type *</label>
            <input type="text" name="garment_type" required defaultValue={order.garment_type} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Due Date</label>
            <input type="date" name="due_date" defaultValue={order.due_date ? order.due_date.substring(0, 10) : ''} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Total Amount (₱) *</label>
            <input type="number" name="total_amount" required min="0" step="0.01" defaultValue={order.total_amount} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Description / Notes</label>
            <textarea name="description" rows={3} defaultValue={order.description || ''} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 resize-none font-medium" />
          </div>
          
        </div>

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
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  )
}
