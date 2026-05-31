import { AppShell } from "@/components/AppShell"
import { CreditCard, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import PaymentForm from "./PaymentForm"

export default async function NewPaymentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('id, garment_type, total_amount, customers(full_name)')
    .neq('status', 'Cancelled')
    .order('created_at', { ascending: false })

  return (
    <AppShell>
      <div className="bg-gray-50 min-h-full p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">

          <header className="flex flex-col gap-3">
            <Link href="/payments" className="text-gray-500 hover:text-indigo-600 flex items-center gap-2 text-sm w-fit transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Payments
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                </div>
                Record Payment
              </h1>
              <p className="text-sm text-gray-600 font-medium mt-1">Log a payment for an existing order.</p>
            </div>
          </header>

          <PaymentForm orders={(orders as any) || []} />

        </div>
      </div>
    </AppShell>
  )
}
