/**
 * Root Layout
 * 
 * Main layout component with dark theme and sidebar navigation.
 * Matches the design from the reference image.
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Financial Project Management',
    description: 'Comprehensive financial planning and project management tool',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-[rgb(17,24,39)] text-white h-screen`}>
                {children}
            </body>
        </html>
    )
}
