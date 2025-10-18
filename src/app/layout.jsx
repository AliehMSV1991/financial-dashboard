import './globals.css'

export const metadata = {
    title: 'Financial Dashboard',
    description: 'AI-powered financial planning dashboard',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-gray-950 text-gray-100">
                {children}
            </body>
        </html>
    )
}

