'use client'

import Sidebar from '@/components/Sidebar'
import ChatBox from '@/components/ChatBox'
import FinancialTable from '@/components/FinancialTable'
import { FinancialProvider } from '@/context/FinancialContext'

export default function Home() {
    return (
        <FinancialProvider>
            <div className="h-screen w-full flex bg-gray-950">
                {/* Left Sidebar */}
                <div className="w-1/5 min-w-[250px] bg-gray-900 border-r border-gray-700">
                    <Sidebar />
                </div>

                {/* Middle Chat Section */}
                <div className="w-2/5 bg-gray-800 border-r border-gray-700">
                    <ChatBox />
                </div>

                {/* Right Financial Table Section */}
                <div className="w-2/5 bg-gray-950">
                    <FinancialTable />
                </div>
            </div>
        </FinancialProvider>
    )
}

