'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateOrder(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const data = {
    garment_type: formData.get('garment_type') as string,
    description: formData.get('description') as string,
    total_amount: parseFloat(formData.get('total_amount') as string),
    due_date: formData.get('due_date') as string || null,
    status: formData.get('status') as string,
  }

  const { error } = await supabase
    .from('orders')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/orders')
  revalidatePath('/')
  redirect(`/orders`)
}
