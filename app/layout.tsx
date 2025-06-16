import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'INET-2025',
  description: 'Created with ❤️ for Villada´s students',
  generator: 'Villada´s students',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
