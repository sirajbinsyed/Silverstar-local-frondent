"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AuthProvider, useAuth } from "@/hooks/useAuth"
import { Sidebar } from "@/components/admin/sidebar"
import { Header } from "@/components/admin/header"
import { Toaster } from "sonner"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [user, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 lg:h-32 lg:w-32 border-b-2 border-amber-400"></div>
      </div>
    )
  }

  if (!user && pathname !== "/admin/login") {
    return null
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:ml-64">
          <Header />
          <main className="flex-1 p-3 lg:p-6 bg-gradient-to-br from-black via-gray-900 to-black min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
      <Toaster position="top-right" />
    </AuthProvider>
  )
}
