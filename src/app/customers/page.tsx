import { AppShell } from "@/components/AppShell"
import { Users, Search, Plus, MoreVertical } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams?.q || ''

  let queryBuilder = supabase.from('customers').select('*').order('created_at', { ascending: false })
  if (query) queryBuilder = queryBuilder.ilike('full_name', `%${query}%`)
  const { data: customers } = await queryBuilder

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  const gradients = ["from-blue-500 to-cyan-500", "from-rose-500 to-pink-500", "from-amber-500 to-orange-500", "from-indigo-500 to-purple-500", "from-emerald-500 to-teal-500"]

  return (
    <AppShell>
      <div className="bg-gray-50 min-h-full p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">

          <header className="flex justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                </div>
                Customers
              </h1>
              <p className="text-sm text-gray-600 font-medium mt-1">Manage your clients and their order history.</p>
            </div>
            <Link href="/customers/new" className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 text-sm min-h-[48px]">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Customer</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </header>

          {/* Search */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 flex items-center gap-4 bg-gray-50">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <form action="/customers" method="GET">
                  <input type="text" name="q" defaultValue={query} placeholder="Search customers..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-sm" />
                </form>
              </div>
              <div className="text-sm font-semibold text-gray-500 whitespace-nowrap">{customers?.length || 0} found</div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Mobile</th>
                    <th className="px-6 py-4 font-semibold">Added</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(!customers || customers.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Users className="w-10 h-10 opacity-40" />
                          <p className="font-semibold text-gray-500">No customers found.</p>
                          <Link href="/customers/new" className="text-indigo-600 font-semibold hover:underline">Add your first customer</Link>
                        </div>
                      </td>
                    </tr>
                  ) : customers.map((customer, i) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0`}>
                            {getInitials(customer.full_name)}
                          </div>
                          <div>
                            <Link href={`/customers/${customer.id}`} className="font-bold text-gray-900 hover:text-indigo-600 transition-colors">{customer.full_name}</Link>
                            {customer.address && <p className="text-xs text-gray-500 truncate max-w-[180px]">{customer.address}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">{customer.mobile_number}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{new Date(customer.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/customers/${customer.id}`} className="p-2 inline-flex hover:bg-gray-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-gray-100">
              {(!customers || customers.length === 0) ? (
                <div className="p-10 text-center flex flex-col items-center gap-2 text-gray-400">
                  <Users className="w-10 h-10 opacity-40" />
                  <p className="font-semibold text-gray-500">No customers found.</p>
                  <Link href="/customers/new" className="text-indigo-600 font-semibold hover:underline">Add one now</Link>
                </div>
              ) : customers.map((customer, i) => (
                <Link href={`/customers/${customer.id}`} key={customer.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0`}>
                    {getInitials(customer.full_name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 text-sm truncate">{customer.full_name}</p>
                    <p className="text-xs text-gray-500 font-medium">{customer.mobile_number}</p>
                  </div>
                  <MoreVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  )
}
