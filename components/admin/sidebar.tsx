"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, UtensilsCrossed, Tags, Settings, Star, Menu, X, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Menu Items", href: "/admin/menu-items", icon: UtensilsCrossed },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden text-amber-400 bg-gray-900/80 backdrop-blur-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-gray-900 to-black border-r border-amber-400/30 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center p-4 lg:p-6 border-b border-amber-400/30">
            <Star className="w-6 h-6 lg:w-8 lg:h-8 text-amber-400 fill-current mr-2" />
            <div className="text-center">
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Silver Star
              </h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 lg:px-4 py-4 lg:py-6 space-y-1 lg:space-y-2">
            {/* View Menu Link */}
            <Link
              href="/"
              className="flex items-center px-3 lg:px-4 py-2 lg:py-3 text-sm font-medium rounded-lg transition-colors text-gray-300 hover:text-amber-400 hover:bg-amber-400/10"
              onClick={() => setIsOpen(false)}
            >
              <Home className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
              <span className="text-xs lg:text-sm">View Menu</span>
            </Link>

            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 lg:px-4 py-2 lg:py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                      : "text-gray-300 hover:text-amber-400 hover:bg-amber-400/10",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                  <span className="text-xs lg:text-sm">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
