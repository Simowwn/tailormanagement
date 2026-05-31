'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updatePayment(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const data = {
    amount: parseFloat(formData.get('amount') as string),
    payment_type: formData.get('payment_type') as string,
    notes: formData.get('notes') as string,
  }

  const { error } = await supabase
    .from('payments')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/payments')
  revalidatePath('/dashboard')
  redirect(`/payments`)
}
