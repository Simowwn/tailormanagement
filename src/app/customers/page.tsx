import { AppShell } from "@/components/AppShell"
import { Users, Plus } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import CustomerList from "./CustomerList"

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
  if (query) {
    let processedQuery = query
    if (processedQuery.startsWith('+63')) {
      processedQuery = '09' + processedQuery.slice(3)
    }
    queryBuilder = queryBuilder.or(`full_name.ilike.%${processedQuery}%,mobile_number.ilike.%${processedQuery}%`)
  }
  const { data: customers } = await queryBuilder

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

          <CustomerList initialCustomers={customers || []} query={query} />

        </div>
      </div>
    </AppShell>
  )
}
