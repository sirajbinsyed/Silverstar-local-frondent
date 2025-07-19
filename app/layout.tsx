import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import '../public/icon.png'


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bake City",
  description: "Delicious menu for Bake City",
  generator: "v0.dev",
  icons: {
    icon: "/icon.png", // path is from public folder root
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
