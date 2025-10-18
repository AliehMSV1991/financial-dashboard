'use client'

import { useState, useMemo, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useFinancial } from '@/context/FinancialContext'

export default function FinancialTable() {
    const { rowData, updateRowData, selectedCells, selectCell, clearSelection, activeTab, setActiveTab, isInitialized, initializeTabData } = useFinancial()

    // Check if current tab is initialized
    const isCurrentTabInitialized = isInitialized[activeTab] || false

    // Helper function for cell renderer
    const cellRenderer = (params) => {
        if (params.data.id === 8) {
            return typeof params.value === 'number' ? params.value.toLocaleString() : '0'
        }
        return params.value
    }

    // Helper function to create month column config
    const createMonthColumn = (field, headerName) => ({
        field,
        headerName,
        width: 120,
        cellRenderer: cellRenderer,
        cellStyle: (params) => {
            const isTotal = params.data.category === 'Total in month'
            const isSelected = selectedCells.includes(`${params.data.id}-${field}`)
            return {
                fontWeight: isTotal ? 'bold' : 'normal',
                color: isTotal ? '#10b981' : '#f9fafb',
                backgroundColor: isSelected ? '#3b82f6' : isTotal ? '#1f2937' : '#111827',
                border: isSelected ? '2px solid #60a5fa' : '1px solid #374151'
            }
        },
        onCellClicked: (params) => {
            selectCell(params.data.id, field)
        }
    })


    const columnDefs = useMemo(() => {
        // Different column structures for different tabs
        if (activeTab === 'salary') {
            return [
                {
                    field: 'jobTitle',
                    headerName: 'Job Title',
                    width: 200,
                    cellStyle: (params) => {
                        const isTotal = params.data.id === 8
                        const isSelected = selectedCells.includes(`${params.data.id}-jobTitle`)
                        return {
                            fontWeight: isTotal ? 'bold' : 'normal',
                            color: isTotal ? '#10b981' : '#f9fafb',
                            backgroundColor: isSelected ? '#3b82f6' : isTotal ? '#1f2937' : '#111827',
                            border: isSelected ? '2px solid #60a5fa' : '1px solid #374151'
                        }
                    },
                    onCellClicked: (params) => {
                        selectCell(params.data.id, 'jobTitle')
                    }
                },
                {
                    field: 'salaryPerMonth',
                    headerName: 'Salary per month',
                    width: 150,
                    cellRenderer: cellRenderer,
                    cellStyle: (params) => {
                        const isTotal = params.data.id === 8
                        const isSelected = selectedCells.includes(`${params.data.id}-salaryPerMonth`)
                        return {
                            fontWeight: isTotal ? 'bold' : 'normal',
                            color: isTotal ? '#10b981' : '#f9fafb',
                            backgroundColor: isSelected ? '#3b82f6' : isTotal ? '#1f2937' : '#111827',
                            border: isSelected ? '2px solid #60a5fa' : '1px solid #374151'
                        }
                    },
                    onCellClicked: (params) => {
                        selectCell(params.data.id, 'salaryPerMonth')
                    }
                },
                {
                    headerName: 'Hiring Plan',
                    children: [
                        createMonthColumn('month1', 'Month 1'),
                        createMonthColumn('month2', 'Month 2'),
                        createMonthColumn('month3', 'Month 3'),
                        createMonthColumn('month4', 'Month 4'),
                        createMonthColumn('month5', 'Month 5'),
                        createMonthColumn('month6', 'Month 6')
                    ]
                }
            ]
        } else {
            // For other tabs (Marketing, Sales, Revenue)
            return [
                {
                    field: 'category',
                    headerName: 'Category',
                    width: 200,
                    cellStyle: (params) => {
                        const isTotal = params.data.category === 'Total in month'
                        const isSelected = selectedCells.includes(`${params.data.id}-category`)
                        return {
                            fontWeight: isTotal ? 'bold' : 'normal',
                            color: isTotal ? '#10b981' : '#f9fafb',
                            backgroundColor: isSelected ? '#3b82f6' : isTotal ? '#1f2937' : '#111827',
                            border: isSelected ? '2px solid #60a5fa' : '1px solid #374151'
                        }
                    },
                    onCellClicked: (params) => {
                        selectCell(params.data.id, 'category')
                    }
                },
                {
                    field: 'description',
                    headerName: 'Description',
                    width: 250,
                    cellStyle: (params) => {
                        const isTotal = params.data.category === 'Total in month'
                        const isSelected = selectedCells.includes(`${params.data.id}-description`)
                        return {
                            fontWeight: isTotal ? 'bold' : 'normal',
                            color: isTotal ? '#10b981' : '#f9fafb',
                            backgroundColor: isSelected ? '#3b82f6' : isTotal ? '#1f2937' : '#111827',
                            border: isSelected ? '2px solid #60a5fa' : '1px solid #374151'
                        }
                    },
                    onCellClicked: (params) => {
                        selectCell(params.data.id, 'description')
                    }
                },
                {
                    headerName: 'First Year',
                    children: [
                        createMonthColumn('month1', 'Month 1'),
                        createMonthColumn('month2', 'Month 2'),
                        createMonthColumn('month3', 'Month 3'),
                        createMonthColumn('month4', 'Month 4'),
                        createMonthColumn('month5', 'Month 5'),
                        createMonthColumn('month6', 'Month 6'),
                        createMonthColumn('month7', 'Month 7'),
                        createMonthColumn('month8', 'Month 8'),
                        createMonthColumn('month9', 'Month 9'),
                        createMonthColumn('month10', 'Month 10'),
                        createMonthColumn('month11', 'Month 11'),
                        createMonthColumn('month12', 'Month 12')
                    ]
                }
            ]
        }
    }, [selectedCells, activeTab])

    const defaultColDef = useMemo(() => ({
        resizable: true,
        sortable: true,
        filter: true,
        editable: (params) => {
            // Make total row non-editable
            return params.data.id !== 8
        },
        cellStyle: {
            color: '#f9fafb',
            backgroundColor: '#111827'
        }
    }), [])

    const onCellValueChanged = (params) => {
        console.log('Cell value changed:', params)
        // Skip if it's the total row
        if (params.data.id === 8) return

        // Update the row data when a cell value changes
        const updatedData = rowData.map(row =>
            row.id === params.data.id
                ? { ...row, [params.colDef.field]: params.newValue }
                : row
        )
        updateRowData(updatedData)
    }

    const addRow = () => {
        const newId = Math.max(...rowData.map(row => row.id)) + 1
        const newRow = {
            id: newId,
            jobTitle: 'New Position',
            salaryPerMonth: 0,
            month1: 'Option',
            month2: 'Option',
            month3: 'Option',
            month4: 'Option',
            month5: 'Option',
            month6: 'Option'
        }
        updateRowData(prev => [...prev.slice(0, -1), newRow, prev[prev.length - 1]])
    }

    const tabs = [
        { id: 'revenue-assumptions', label: 'Revenue Assumptions' },
        { id: 'marketing', label: 'Marketing' },
        { id: 'salary', label: 'Salary' },
        { id: 'current-cost', label: 'Current Cost' },
        { id: 'equipment-hardware', label: 'Equipment and Hardware' }
    ]

    return (
        <div className="h-full flex flex-col bg-gray-950">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-sm text-gray-400 mb-1">
                            {` Workflow > Fundraising > Financial Projection > Financial Plan 3`}
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <h1 className="text-xl font-semibold text-gray-100">Financial Plan 3</h1>
                        </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
                        Share
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 py-3 border-b border-gray-700">
                <div className="flex space-x-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === tab.id
                                ? 'text-blue-400 border-blue-400'
                                : 'text-gray-400 border-transparent hover:text-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 p-6">
                {!isCurrentTabInitialized ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-200 mb-2">No Data Available</h3>
                            <p className="text-gray-400 mb-4">Use the AI Assistant to generate initial data for this tab.</p>
                            <p className="text-sm text-gray-500">Ask questions like "What's your marketing budget?" or "What's your target revenue?"</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-full ">
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            onCellValueChanged={onCellValueChanged}
                            animateRows={true}
                            rowSelection="multiple"
                            suppressRowClickSelection={true}
                            className="h-full"
                            domLayout="normal"
                            suppressMenuHide={true}
                            enableCellTextSelection={true}
                            ensureDomOrder={true}
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex space-x-3">
                    <button
                        onClick={addRow}
                        className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                        Add row
                    </button>
                    {selectedCells.length > 0 && (
                        <button
                            onClick={clearSelection}
                            className="px-4 py-2 bg-blue-600 border border-blue-500 rounded-lg text-white hover:bg-blue-700 transition-colors"
                        >
                            Clear Selection ({selectedCells.length})
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

