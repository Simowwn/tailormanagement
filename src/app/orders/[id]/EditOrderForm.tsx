"use client"

import { useState } from "react"
import { Scissors, AlertCircle, Save, Ruler, Edit } from "lucide-react"
import { updateOrder } from "./actions"
import Link from "next/link"

export default function EditOrderForm({ order, measurements }: { order: any, measurements: any }) {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Order Form */}
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm h-fit">
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
              <label className="text-sm font-semibold text-slate-700 ml-1">Amount Paid (₱)</label>
              <input type="text" disabled value={`₱${(order.amount_paid || 0).toFixed(2)}`} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed" />
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

      {/* Right Column: Size Profile Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-fit space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
            <Ruler className="w-5 h-5 text-indigo-600" />
            Size Profile
          </h3>
          <Link 
            href={`/customers/${order.customer_id}`} 
            className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Sizes
          </Link>
        </div>

        {measurements ? (
          <div className="space-y-6">
            {/* Top / Shirt */}
            <div>
              <h4 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider mb-3">Top / Shirt</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-slate-50/50 border border-slate-100 p-3 rounded-2xl">
                {[
                  { label: "Neck", val: measurements.neck },
                  { label: "Chest", val: measurements.chest },
                  { label: "Shoulder", val: measurements.shoulder },
                  { label: "Sleeve Length", val: measurements.sleeve_length },
                  { label: "Shirt Length", val: measurements.shirt_length },
                  { label: "Hips", val: measurements.shirt_hips },
                  { label: "Bust", val: measurements.bust },
                  { label: "Waist", val: measurements.shirt_waist },
                ].map((f, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                    <span className="text-slate-500 font-semibold text-xs">{f.label}</span>
                    <span className="text-slate-800 font-bold">{f.val !== null && f.val !== undefined ? `${f.val} in` : "—"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom / Pants */}
            <div>
              <h4 className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider mb-3">Bottom / Pants</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-slate-50/50 border border-slate-100 p-3 rounded-2xl">
                {[
                  { label: "Waist", val: measurements.waist },
                  { label: "Hips", val: measurements.hips },
                  { label: "Inseam", val: measurements.inseam },
                  { label: "Crotch", val: measurements.crotch },
                  { label: "Length", val: measurements.bottom_length },
                ].map((f, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                    <span className="text-slate-500 font-semibold text-xs">{f.label}</span>
                    <span className="text-slate-800 font-bold">{f.val !== null && f.val !== undefined ? `${f.val} in` : "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-2">
            <p className="text-sm font-semibold text-slate-500">No sizes recorded yet.</p>
            <Link href={`/customers/${order.customer_id}`} className="inline-flex text-xs font-bold text-indigo-600 hover:underline">
              Add size measurements
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}


