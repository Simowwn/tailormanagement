import { AppShell } from "@/components/AppShell"
import { Scissors, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import OrderForm from "./OrderForm"

export default async function NewOrderPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: customers } = await supabase
    .from('customers')
    .select('id, full_name, mobile_number')
    .order('full_name')

  return (
    <AppShell>
      <div className="bg-gray-50 min-h-full p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">

          <header className="flex flex-col gap-3">
            <Link href="/orders" className="text-gray-500 hover:text-indigo-600 flex items-center gap-2 text-sm w-fit transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Scissors className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                </div>
                New Order
              </h1>
              <p className="text-sm text-gray-600 font-medium mt-1">Create a new order, add a customer, and save measurements all at once.</p>
            </div>
          </header>

          <OrderForm customers={customers || []} />

        </div>
      </div>
    </AppShell>
  )
}
