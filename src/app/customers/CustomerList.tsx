"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, Search, Plus, MoreVertical, AlertCircle, Trash2, Edit3, X } from "lucide-react"
import { deleteCustomer } from "./[id]/actions"

interface Customer {
  id: string
  full_name: string
  mobile_number: string
  address?: string
  created_at: string
}

export default function CustomerList({
  initialCustomers,
  query: initialQuery = ""
}: {
  initialCustomers: Customer[]
  query?: string
}) {
  const router = useRouter()
  const [searchVal, setSearchVal] = useState(initialQuery)
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()

  const gradients = [
    "from-blue-500 to-cyan-500",
    "from-rose-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-indigo-500 to-purple-500",
    "from-emerald-500 to-teal-500"
  ]

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchVal.trim()) {
      router.push(`/customers?q=${encodeURIComponent(searchVal.trim())}`)
    } else {
      router.push("/customers")
    }
  }

  const handleDelete = async () => {
    if (!activeCustomer) return
    setIsDeleting(true)
    setError(null)
    try {
      const result = await deleteCustomer(activeCustomer.id)
      if (result?.error) {
        setError(result.error)
        setIsDeleting(false)
      } else {
        // Success
        setIsDeleting(false)
        setShowConfirmDelete(false)
        setActiveCustomer(null)
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while deleting.")
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-sm"
              />
            </form>
          </div>
          <div className="text-sm font-semibold text-slate-500 whitespace-nowrap">
            {initialCustomers.length} found
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Mobile</th>
                <th className="px-6 py-4 font-semibold">Added</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Users className="w-10 h-10 opacity-40" />
                      <p className="font-semibold text-slate-500">No customers found.</p>
                      <Link href="/customers/new" className="text-indigo-600 font-semibold hover:underline">
                        Add your first customer
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                initialCustomers.map((customer, i) => (
                  <tr
                    key={customer.id}
                    onClick={() => router.push(`/customers/${customer.id}`)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                            gradients[i % gradients.length]
                          } flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0`}
                        >
                          {getInitials(customer.full_name)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {customer.full_name}
                          </div>
                          {customer.address && (
                            <p className="text-xs text-slate-500 truncate max-w-[180px] mt-0.5">
                              {customer.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{customer.mobile_number}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation()
                          setActiveCustomer(customer)
                          setShowConfirmDelete(false)
                          setError(null)
                        }}
                        className="p-2 inline-flex hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-slate-100">
          {initialCustomers.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center gap-2 text-slate-400">
              <Users className="w-10 h-10 opacity-40" />
              <p className="font-semibold text-slate-500">No customers found.</p>
              <Link href="/customers/new" className="text-indigo-600 font-semibold hover:underline">
                Add one now
              </Link>
            </div>
          ) : (
            initialCustomers.map((customer, i) => (
              <div
                key={customer.id}
                onClick={() => router.push(`/customers/${customer.id}`)}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-br ${
                    gradients[i % gradients.length]
                  } flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0`}
                >
                  {getInitials(customer.full_name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 text-sm truncate">{customer.full_name}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{customer.mobile_number}</p>
                </div>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation()
                    setActiveCustomer(customer)
                    setShowConfirmDelete(false)
                    setError(null)
                  }}
                  className="p-2 -mr-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Options & Confirmation Modal */}
      {activeCustomer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden w-full max-w-sm max-h-[90vh] flex flex-col transform scale-100 transition-transform">
            {/* Modal Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {showConfirmDelete ? "Delete Customer" : "Customer Actions"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[240px]">
                  {activeCustomer.full_name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveCustomer(null)
                  setShowConfirmDelete(false)
                }}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {!showConfirmDelete ? (
                /* Primary Actions Options */
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      router.push(`/customers/${activeCustomer.id}`)
                      setActiveCustomer(null)
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit3 className="w-4.5 h-4.5" />
                    Edit / View Details
                  </button>
                  <button
                    onClick={() => {
                      setError(null)
                      setShowConfirmDelete(true)
                    }}
                    className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                    Delete Customer
                  </button>
                  <button
                    onClick={() => setActiveCustomer(null)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl transition-all text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                /* Confirm Delete Warning */
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-100 text-amber-800 p-4 rounded-2xl flex gap-3 text-xs font-medium">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                    <div>
                      <p className="font-bold">Cascade Warning</p>
                      <p className="mt-1 leading-relaxed text-amber-700">
                        This action will permanently delete all associated orders, payments, and size measurements for this client.
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 text-center px-2">
                    Are you absolutely sure you want to delete <strong className="text-slate-800 font-bold">{activeCustomer.full_name}</strong>?
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowConfirmDelete(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl transition-all text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-rose-600/10 text-sm disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? "Deleting..." : "Yes, Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
