"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Scissors, CreditCard, LogOut, Settings, X } from "lucide-react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Orders", href: "/orders", icon: Scissors },
    { name: "Payments", href: "/payments", icon: CreditCard },
  ]

  return (
    <div className="flex h-full w-64 flex-col bg-white text-gray-900 border-r border-gray-200">
      {/* Sidebar header */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">TailorSwift</span>
        </div>
        {/* Close button — only visible on mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1 mt-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={twMerge(
                clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-semibold text-sm min-h-[48px]",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                )
              )}
            >
              <item.icon
                className={clsx(
                  "w-5 h-5 flex-shrink-0 transition-colors duration-200",
                  isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-500"
                )}
              />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-gray-600 font-semibold text-sm min-h-[48px] hover:text-indigo-600 hover:bg-gray-50 transition-colors group">
          <Settings className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
          <span>Settings</span>
        </button>
        <form action="/auth/signout" method="post" className="w-full">
          <button type="submit" className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-gray-600 font-semibold text-sm min-h-[48px] hover:text-rose-600 hover:bg-rose-50 transition-colors group">
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors flex-shrink-0" />
            <span>Log Out</span>
          </button>
        </form>
      </div>
    </div>
  )
}
