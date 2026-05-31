import { AppShell } from "@/components/AppShell"
import { CreditCard, Search, Receipt, Plus } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function PaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: payments } = await supabase
    .from('payments')
    .select('*, orders(id, customers(full_name))')
    .order('payment_date', { ascending: false })

  const typeStyle = (type: string) =>
    type === 'Full Payment' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
    type === 'Installment' ? 'bg-blue-50 text-blue-700 border-blue-200' :
    'bg-amber-50 text-amber-700 border-amber-200'

  return (
    <AppShell>
      <div className="bg-gray-50 min-h-full p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">

          <header className="flex justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                </div>
                Payments
              </h1>
              <p className="text-sm text-gray-600 font-medium mt-1">View payment history and balances.</p>
            </div>
            <Link href="/payments/new" className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 text-sm min-h-[48px]">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Record Payment</span>
              <span className="sm:hidden">Record</span>
            </Link>
          </header>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" placeholder="Search payments..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-sm" />
              </div>
              <div className="text-sm font-semibold text-gray-500 whitespace-nowrap">{payments?.length || 0} records</div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Order ID</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Notes</th>
                    <th className="px-6 py-4 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(!payments || payments.length === 0) ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Receipt className="w-10 h-10 opacity-40" />
                          <p className="font-semibold text-gray-500">No payments recorded yet.</p>
                          <Link href="/payments/new" className="text-indigo-600 font-semibold hover:underline">Record one now</Link>
                        </div>
                      </td>
                    </tr>
                  ) : payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500 font-medium">{new Date(payment.payment_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{(payment.orders as any)?.customers?.full_name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{(payment.orders as any)?.id?.substring(0,8).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${typeStyle(payment.payment_type || 'Downpayment')}`}>{payment.payment_type || 'Downpayment'}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 font-medium truncate max-w-xs">{payment.notes || '—'}</td>
                      <td className="px-6 py-4 text-right font-extrabold text-emerald-600">₱{payment.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-gray-100">
              {(!payments || payments.length === 0) ? (
                <div className="p-10 text-center flex flex-col items-center gap-2 text-gray-400">
                  <Receipt className="w-10 h-10 opacity-40" />
                  <p className="font-semibold text-gray-500">No payments yet.</p>
                  <Link href="/payments/new" className="text-indigo-600 font-semibold hover:underline">Record one now</Link>
                </div>
              ) : payments.map((payment) => (
                <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{(payment.orders as any)?.customers?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{new Date(payment.payment_date).toLocaleDateString()} · #{(payment.orders as any)?.id?.substring(0,8).toUpperCase()}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${typeStyle(payment.payment_type || 'Downpayment')}`}>{payment.payment_type || 'Downpayment'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-medium truncate max-w-[60%]">{payment.notes || '—'}</p>
                    <span className="font-extrabold text-emerald-600">₱{payment.amount}</span>
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
