import { AppShell } from "@/components/AppShell"
import { Users, Scissors, CalendarClock, AlertCircle, ArrowUpRight, PackageOpen } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { count: totalCustomers } = await supabase.from('customers').select('*', { count: 'exact', head: true })
  const { data: orders } = await supabase.from('orders').select('*, customers(full_name)').order('created_at', { ascending: false }).limit(5)
  const { data: customers } = await supabase.from('customers').select('*').order('created_at', { ascending: false }).limit(5)
  const { data: unpaidOrders } = await supabase.from('orders').select('id, total_amount')
  const { count: activeOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).neq('status', 'Completed')

  const stats = [
    { name: "Total Customers", value: totalCustomers || 0, change: "All time", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { name: "Active Orders", value: activeOrders || 0, change: "In progress", icon: Scissors, color: "text-indigo-600", bg: "bg-indigo-100" },
    { name: "Due Today", value: "0", change: "Requires date check", icon: CalendarClock, color: "text-amber-600", bg: "bg-amber-100" },
    { name: "Unpaid", value: unpaidOrders?.length || 0, change: "Pending payment", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-100" },
  ]

  const recentOrders = orders || []
  const recentCustomers = customers || []

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  const gradients = ["from-blue-500 to-blue-600", "from-rose-500 to-rose-600", "from-amber-500 to-amber-600", "from-indigo-500 to-indigo-600", "from-emerald-500 to-emerald-600"]

  const statusStyle = (status: string) =>
    status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
    status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
    status === 'Ready for Pickup' ? 'bg-amber-50 text-amber-700 border-amber-200' :
    'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <AppShell>
      <div className="bg-gray-50 min-h-full p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">

          {/* Header */}
          <header className="flex justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
              <p className="text-sm md:text-base text-gray-600 font-medium mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            <Link href="/orders/new" className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 text-sm md:text-base min-h-[48px]">
              <Scissors className="w-4 h-4" />
              <span className="hidden sm:inline">New Order</span>
              <span className="sm:hidden">New</span>
            </Link>
          </header>

          {/* Stats — 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm hover:border-indigo-200 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 md:p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-gray-600 font-semibold text-xs md:text-sm">{stat.name}</h3>
                <span className="text-2xl md:text-3xl font-extrabold text-gray-900">{stat.value}</span>
                <p className="text-xs text-gray-500 mt-1 font-medium">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

            {/* Recent Orders */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Orders</h2>
                <Link href="/orders" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
                  View all <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Customer</th>
                      <th className="px-6 py-4 font-semibold">Item</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-2 text-gray-400">
                            <PackageOpen className="w-10 h-10 opacity-40" />
                            <p className="font-semibold text-gray-500">No orders yet.</p>
                            <Link href="/orders/new" className="text-indigo-600 font-semibold hover:underline">Create one now</Link>
                          </div>
                        </td>
                      </tr>
                    ) : recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900"><Link href={`/orders/${order.id}`} className="hover:text-indigo-600 hover:underline">{order.customers?.full_name || 'Unknown'}</Link></td>
                        <td className="px-6 py-4 text-gray-600 font-medium">{order.garment_type}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle(order.status)}`}>{order.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-700">₱{order.total_amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="md:hidden space-y-3">
                {recentOrders.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm flex flex-col items-center gap-2 text-gray-400">
                    <PackageOpen className="w-10 h-10 opacity-40" />
                    <p className="font-semibold text-gray-500">No orders yet.</p>
                    <Link href="/orders/new" className="text-indigo-600 font-semibold hover:underline">Create one now</Link>
                  </div>
                ) : recentOrders.map((order) => (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900 text-sm"><Link href={`/orders/${order.id}`} className="hover:text-indigo-600 hover:underline">{order.customers?.full_name || 'Unknown'}</Link></p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{order.garment_type}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle(order.status)}`}>{order.status}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500 font-medium">#{order.id.substring(0,8).toUpperCase()}</span>
                      <span className="font-extrabold text-gray-800">₱{order.total_amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Customers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Customers</h2>
                <Link href="/customers/new" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">Add new</Link>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="space-y-4">
                  {recentCustomers.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-gray-400">
                      <Users className="w-10 h-10 mb-2 opacity-40" />
                      <p className="font-semibold text-gray-500 text-sm">No customers yet.</p>
                    </div>
                  ) : recentCustomers.map((customer, i) => (
                    <Link href={`/customers/${customer.id}`} key={customer.id} className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0`}>
                        {getInitials(customer.full_name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{customer.full_name}</p>
                        <p className="text-xs text-gray-500 font-medium">{new Date(customer.created_at).toLocaleDateString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppShell>
  )
}
