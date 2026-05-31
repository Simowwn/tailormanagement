'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createCombinedOrder(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const isNewCustomer = formData.get('is_new_customer') === 'true'
  let customerId = formData.get('existing_customer_id') as string

  // 1. Create new customer if requested
  if (isNewCustomer) {
    const customerData = {
      user_id: user.id,
      full_name: formData.get('full_name') as string,
      mobile_number: formData.get('mobile_number') as string,
      address: formData.get('address') as string,
    }
    const { data: newCustomer, error: customerError } = await supabase
      .from('customers')
      .insert(customerData)
      .select()
      .single()

    if (customerError) return { error: "Failed to create customer: " + customerError.message }
    customerId = newCustomer.id
  }

  // 2. Insert measurements if any field is provided
  const chest = formData.get('chest') as string
  const waist = formData.get('waist') as string
  const hips = formData.get('hips') as string
  const shoulder = formData.get('shoulder') as string
  const sleeve_length = formData.get('sleeve_length') as string
  const shirt_length = formData.get('shirt_length') as string
  const inseam = formData.get('inseam') as string
  const neck = formData.get('neck') as string

  if (chest || waist || hips || shoulder || sleeve_length || shirt_length || inseam || neck) {
    const measurementData = {
      customer_id: customerId,
      user_id: user.id,
      chest: chest ? parseFloat(chest) : null,
      waist: waist ? parseFloat(waist) : null,
      hips: hips ? parseFloat(hips) : null,
      shoulder: shoulder ? parseFloat(shoulder) : null,
      sleeve_length: sleeve_length ? parseFloat(sleeve_length) : null,
      shirt_length: shirt_length ? parseFloat(shirt_length) : null,
      inseam: inseam ? parseFloat(inseam) : null,
      neck: neck ? parseFloat(neck) : null,
    }
    const { error: measurementError } = await supabase
      .from('measurements')
      .insert(measurementData)
    
    if (measurementError) return { error: "Failed to save measurements: " + measurementError.message }
  }

  // 3. Create the Order
  const orderData = {
    user_id: user.id,
    customer_id: customerId,
    garment_type: formData.get('garment_type') as string,
    description: formData.get('description') as string,
    total_amount: parseFloat(formData.get('total_amount') as string),
    due_date: formData.get('due_date') as string || null,
    status: 'Pending',
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single()

  if (orderError) return { error: "Failed to create order: " + orderError.message }

  // 4. Create Initial Payment if provided
  const initialPaymentStr = formData.get('initial_payment') as string
  if (initialPaymentStr && parseFloat(initialPaymentStr) > 0) {
    const paymentAmount = parseFloat(initialPaymentStr)
    const paymentType = formData.get('payment_type') as string // "Downpayment" or "Full Payment"
    
    const paymentData = {
      user_id: user.id,
      order_id: order.id,
      amount: paymentAmount,
      payment_type: paymentType,
      notes: `Initial ${paymentType}`,
    }

    const { error: paymentError } = await supabase
      .from('payments')
      .insert(paymentData)
      
    if (paymentError) return { error: "Order created, but failed to save payment: " + paymentError.message }
  }

  revalidatePath('/customers')
  revalidatePath('/orders')
  revalidatePath('/payments')
  revalidatePath('/')
  redirect('/orders')
}
