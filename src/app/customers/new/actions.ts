'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createCustomer(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const data = {
    user_id: user.id,
    full_name: formData.get('full_name') as string,
    mobile_number: formData.get('mobile_number') as string,
    address: formData.get('address') as string,
    notes: formData.get('notes') as string,
  }

  const { data: customer, error } = await supabase
    .from('customers')
    .insert(data)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/customers')
  revalidatePath('/')
  redirect(`/customers/${customer.id}`)
}
