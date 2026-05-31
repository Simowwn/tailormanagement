import { AppShell } from "@/components/AppShell"
import { Scissors, Search, Plus, PackageOpen } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, customers(full_name)')
    .order('created_at', { ascending: false })

  const statusStyle = (status: string) =>
    status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
    status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
    status === 'Ready for Pickup' ? 'bg-amber-50 text-amber-700 border-amber-200' :
    'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <AppShell>
      <div className="bg-gray-50 min-h-full p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">

          <header className="flex justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Scissors className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                </div>
                Orders
              </h1>
              <p className="text-sm text-gray-600 font-medium mt-1">Track and manage all customer orders.</p>
            </div>
            <Link href="/orders/new" className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 text-sm min-h-[48px]">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Order</span>
              <span className="sm:hidden">New</span>
            </Link>
          </header>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" placeholder="Search orders..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-sm" />
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Order ID</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Garment</th>
                    <th className="px-6 py-4 font-semibold">Due Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(!orders || orders.length === 0) ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <PackageOpen className="w-10 h-10 opacity-40" />
                          <p className="font-semibold text-gray-500">No orders found.</p>
                          <Link href="/orders/new" className="text-indigo-600 font-semibold hover:underline">Create your first order</Link>
                        </div>
                      </td>
                    </tr>
                  ) : orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-700">{order.id.substring(0,8).toUpperCase()}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{order.customers?.full_name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{order.garment_type}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{order.due_date ? new Date(order.due_date).toLocaleDateString() : 'Not Set'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle(order.status)}`}>{order.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-700">${order.total_amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-gray-100">
              {(!orders || orders.length === 0) ? (
                <div className="p-10 text-center flex flex-col items-center gap-2 text-gray-400">
                  <PackageOpen className="w-10 h-10 opacity-40" />
                  <p className="font-semibold text-gray-500">No orders found.</p>
                  <Link href="/orders/new" className="text-indigo-600 font-semibold hover:underline">Create one now</Link>
                </div>
              ) : orders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{order.customers?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{order.garment_type}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle(order.status)}`}>{order.status}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                      <span>#{order.id.substring(0,8).toUpperCase()}</span>
                      {order.due_date && <span>Due: {new Date(order.due_date).toLocaleDateString()}</span>}
                    </div>
                    <span className="font-extrabold text-gray-800">${order.total_amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  )
}
