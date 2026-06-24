'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateCustomer(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const data = {
    full_name: formData.get('full_name') as string,
    mobile_number: formData.get('mobile_number') as string,
    address: formData.get('address') as string,
    notes: formData.get('notes') as string,
  }

  const { error } = await supabase
    .from('customers')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  // Handle measurements update if provided
  const chest = formData.get('chest') as string
  const waist = formData.get('waist') as string
  const hips = formData.get('hips') as string
  const shoulder = formData.get('shoulder') as string
  const sleeve_length = formData.get('sleeve_length') as string
  const shirt_length = formData.get('shirt_length') as string
  const inseam = formData.get('inseam') as string
  const neck = formData.get('neck') as string
  const shirt_waist = formData.get('shirt_waist') as string
  const shirt_hips = formData.get('shirt_hips') as string
  const bust = formData.get('bust') as string
  const crotch = formData.get('crotch') as string
  const bottom_length = formData.get('bottom_length') as string

  if (
    chest || waist || hips || shoulder || sleeve_length || shirt_length || 
    inseam || neck || shirt_waist || shirt_hips || bust || crotch || bottom_length
  ) {
    const measurementData = {
      customer_id: id,
      user_id: user.id,
      chest: chest ? parseFloat(chest) : null,
      waist: waist ? parseFloat(waist) : null,
      hips: hips ? parseFloat(hips) : null,
      shoulder: shoulder ? parseFloat(shoulder) : null,
      sleeve_length: sleeve_length ? parseFloat(sleeve_length) : null,
      shirt_length: shirt_length ? parseFloat(shirt_length) : null,
      inseam: inseam ? parseFloat(inseam) : null,
      neck: neck ? parseFloat(neck) : null,
      shirt_waist: shirt_waist ? parseFloat(shirt_waist) : null,
      shirt_hips: shirt_hips ? parseFloat(shirt_hips) : null,
      bust: bust ? parseFloat(bust) : null,
      crotch: crotch ? parseFloat(crotch) : null,
      bottom_length: bottom_length ? parseFloat(bottom_length) : null,
    }

    // Check if measurements exist
    const { data: existing } = await supabase.from('measurements').select('id').eq('customer_id', id).single()

    if (existing) {
      await supabase.from('measurements').update(measurementData).eq('customer_id', id)
    } else {
      await supabase.from('measurements').insert(measurementData)
    }
  }

  revalidatePath('/customers')
  revalidatePath('/')
  redirect(`/customers`)
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/customers')
  revalidatePath('/')
  return { success: true }
}
