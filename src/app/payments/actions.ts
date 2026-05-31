"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function recordPayment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  const order_id = formData.get("order_id") as string
  const amount = parseFloat(formData.get("amount") as string)
  const payment_type = formData.get("payment_type") as string
  const notes = formData.get("notes") as string
  const payment_date = formData.get("payment_date") as string

  if (!order_id) return { error: "Please select an order." }
  if (!amount || amount <= 0) return { error: "Please enter a valid amount." }

  const { error } = await supabase.from("payments").insert({
    order_id,
    user_id: user.id,
    amount,
    payment_type: payment_type || "Downpayment",
    notes: notes || null,
    payment_date: payment_date || new Date().toISOString().split("T")[0],
  })

  if (error) return { error: error.message }

  revalidatePath("/payments")
  revalidatePath("/orders")
  redirect("/payments")
}
