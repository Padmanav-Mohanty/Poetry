import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Verse — A Home for Poetry",
  description:
    "Verse is a personal anthology where poets share their work and readers find the lines that stay with them — free, forever.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="pt-16" style={{ background: "var(--offwhite)" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
