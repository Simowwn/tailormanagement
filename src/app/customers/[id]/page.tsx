import { AppShell } from "@/components/AppShell"
import { Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import EditCustomerForm from "./EditCustomerForm"

export default async function EditCustomerPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const resolvedParams = await params
  const { id } = resolvedParams

  const { data: customer } = await supabase.from('customers').select('*').eq('id', id).single()
  const { data: measurements } = await supabase.from('measurements').select('*').eq('customer_id', id).single()

  if (!customer) redirect('/customers')

  return (
    <AppShell>
      <div className="bg-slate-50 min-h-full p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
          
          <header className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Link href="/customers" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-500">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">Edit Customer</h1>
                <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Update details for {customer.full_name}.</p>
              </div>
            </div>
          </header>

          <EditCustomerForm customer={customer} measurements={measurements} />
          
        </div>
      </div>
    </AppShell>
  )
}
