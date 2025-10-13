'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const FinancialContext = createContext()

export function FinancialProvider({ children }) {
    const [selectedCells, setSelectedCells] = useState([])
    const [rowData, setRowData] = useState([
        {
            id: 1,
            jobTitle: 'CEO',
            salaryPerMonth: 15000,
            month1: 15000,
            month2: 15000,
            month3: 15000,
            month4: 15000,
            month5: 15000,
            month6: 15000
        },
        {
            id: 2,
            jobTitle: 'CTO',
            salaryPerMonth: 12000,
            month1: 12000,
            month2: 12000,
            month3: 12000,
            month4: 12000,
            month5: 12000,
            month6: 12000
        },
        {
            id: 3,
            jobTitle: 'CFO',
            salaryPerMonth: 10000,
            month1: 10000,
            month2: 10000,
            month3: 10000,
            month4: 10000,
            month5: 10000,
            month6: 10000
        },
        {
            id: 4,
            jobTitle: 'VP Engineering',
            salaryPerMonth: 8000,
            month1: 8000,
            month2: 8000,
            month3: 8000,
            month4: 8000,
            month5: 8000,
            month6: 8000
        },
        {
            id: 5,
            jobTitle: 'VP Marketing',
            salaryPerMonth: 7000,
            month1: 7000,
            month2: 7000,
            month3: 7000,
            month4: 7000,
            month5: 7000,
            month6: 7000
        },
        {
            id: 6,
            jobTitle: 'VP Sales',
            salaryPerMonth: 7500,
            month1: 7500,
            month2: 7500,
            month3: 7500,
            month4: 7500,
            month5: 7500,
            month6: 7500
        },
        {
            id: 7,
            jobTitle: 'Senior Developer',
            salaryPerMonth: 6000,
            month1: 6000,
            month2: 6000,
            month3: 6000,
            month4: 6000,
            month5: 6000,
            month6: 6000
        },
        {
            id: 8,
            jobTitle: 'Total',
            salaryPerMonth: 65500, // Calculated total
            month1: 65500,
            month2: 65500,
            month3: 65500,
            month4: 65500,
            month5: 65500,
            month6: 65500
        }
    ])

    // Calculate totals on initial load
    useEffect(() => {
        setRowData(prevData => calculateTotals(prevData))
    }, [])

    const updateRowData = (newData) => {
        // Calculate totals for the Total row
        const updatedData = calculateTotals(newData)
        setRowData(updatedData)
    }

    const calculateTotals = (data) => {
        if (data.length === 0) return data

        // Get all rows except the last one (total row)
        const dataRows = data.slice(0, -1)

        // Calculate sums for each column
        let salaryPerMonthTotal = 0
        let month1Total = 0
        let month2Total = 0
        let month3Total = 0
        let month4Total = 0
        let month5Total = 0
        let month6Total = 0

        dataRows.forEach(row => {
            if (typeof row.salaryPerMonth === 'number') {
                salaryPerMonthTotal += row.salaryPerMonth
            }
            if (typeof row.month1 === 'number') {
                month1Total += row.month1
            }
            if (typeof row.month2 === 'number') {
                month2Total += row.month2
            }
            if (typeof row.month3 === 'number') {
                month3Total += row.month3
            }
            if (typeof row.month4 === 'number') {
                month4Total += row.month4
            }
            if (typeof row.month5 === 'number') {
                month5Total += row.month5
            }
            if (typeof row.month6 === 'number') {
                month6Total += row.month6
            }
        })

        console.log('Calculating totals:', {
            salaryPerMonthTotal,
            month1Total,
            month2Total,
            month3Total,
            month4Total,
            month5Total,
            month6Total
        })

        // Create updated total row
        const updatedTotalRow = {
            id: 8,
            jobTitle: 'Total',
            salaryPerMonth: salaryPerMonthTotal,
            month1: month1Total,
            month2: month2Total,
            month3: month3Total,
            month4: month4Total,
            month5: month5Total,
            month6: month6Total
        }

        // Return updated data with calculated totals
        return [...dataRows, updatedTotalRow]
    }

    const applySalaryChange = (command) => {
        const { action, column, rows, jobTitle, percent, value, count, startMonth, endMonth } = command

        if (action === 'increase_range') {
            // Handle range increase operations like "increase salary in CTO by 15% from month1 to month3"
            setRowData(prevData => {
                const updatedData = prevData.map(row => {
                    if (row.id === 8) return row // Skip total row

                    const rowTitle = row.jobTitle.toLowerCase()
                    const targetTitle = jobTitle.toLowerCase()
                    const shouldUpdate = rowTitle.includes(targetTitle) || targetTitle.includes(rowTitle)

                    if (shouldUpdate) {
                        const newRow = { ...row }
                        const monthColumns = ['month1', 'month2', 'month3', 'month4', 'month5', 'month6']
                        const startIndex = monthColumns.indexOf(startMonth)
                        const endIndex = monthColumns.indexOf(endMonth)

                        if (startIndex !== -1 && endIndex !== -1) {
                            for (let i = startIndex; i <= endIndex; i++) {
                                newRow[monthColumns[i]] = Math.round(newRow[monthColumns[i]] * (1 + percent / 100))
                            }
                        }
                        return newRow
                    }
                    return row
                })
                return calculateTotals(updatedData)
            })
            return
        }

        if (action === 'decrease_range') {
            // Handle range decrease operations like "decrease salary in CTO by 10% from month1 to month3"
            setRowData(prevData => {
                const updatedData = prevData.map(row => {
                    if (row.id === 8) return row // Skip total row

                    const rowTitle = row.jobTitle.toLowerCase()
                    const targetTitle = jobTitle.toLowerCase()
                    const shouldUpdate = rowTitle.includes(targetTitle) || targetTitle.includes(rowTitle)

                    if (shouldUpdate) {
                        const newRow = { ...row }
                        const monthColumns = ['month1', 'month2', 'month3', 'month4', 'month5', 'month6']
                        const startIndex = monthColumns.indexOf(startMonth)
                        const endIndex = monthColumns.indexOf(endMonth)

                        if (startIndex !== -1 && endIndex !== -1) {
                            for (let i = startIndex; i <= endIndex; i++) {
                                newRow[monthColumns[i]] = Math.round(newRow[monthColumns[i]] * (1 - percent / 100))
                            }
                        }
                        return newRow
                    }
                    return row
                })
                return calculateTotals(updatedData)
            })
            return
        }

        if (action === 'set_range') {
            // Handle range operations like "حقوق CEO رو از ماه اول تا سوم صفر کن"
            setRowData(prevData => {
                const updatedData = prevData.map(row => {
                    if (row.id === 8) return row // Skip total row

                    const rowTitle = row.jobTitle.toLowerCase()
                    const targetTitle = jobTitle.toLowerCase()
                    const shouldUpdate = rowTitle.includes(targetTitle) || targetTitle.includes(rowTitle)

                    if (shouldUpdate) {
                        const newRow = { ...row }
                        const monthColumns = ['month1', 'month2', 'month3', 'month4', 'month5', 'month6']
                        const startIndex = monthColumns.indexOf(startMonth)
                        const endIndex = monthColumns.indexOf(endMonth)

                        if (startIndex !== -1 && endIndex !== -1) {
                            for (let i = startIndex; i <= endIndex; i++) {
                                newRow[monthColumns[i]] = value
                            }
                        }
                        return newRow
                    }
                    return row
                })
                return calculateTotals(updatedData)
            })
            return
        }

        if (action === 'set_selected') {
            // Handle selected cells operations
            setRowData(prevData => {
                const updatedData = prevData.map(row => {
                    const newRow = { ...row }
                    selectedCells.forEach(cellKey => {
                        const [rowId, column] = cellKey.split('-')
                        if (row.id === parseInt(rowId)) {
                            newRow[column] = value
                        }
                    })
                    return newRow
                })
                return calculateTotals(updatedData)
            })
            return
        }

        if (action === 'increase_selected') {
            // Handle selected cells increase
            setRowData(prevData => {
                const updatedData = prevData.map(row => {
                    const newRow = { ...row }
                    selectedCells.forEach(cellKey => {
                        const [rowId, column] = cellKey.split('-')
                        if (row.id === parseInt(rowId)) {
                            newRow[column] = Math.round(newRow[column] * (1 + percent / 100))
                        }
                    })
                    return newRow
                })
                return calculateTotals(updatedData)
            })
            return
        }

        if (action === 'decrease_selected') {
            // Handle selected cells decrease
            setRowData(prevData => {
                const updatedData = prevData.map(row => {
                    const newRow = { ...row }
                    selectedCells.forEach(cellKey => {
                        const [rowId, column] = cellKey.split('-')
                        if (row.id === parseInt(rowId)) {
                            newRow[column] = Math.round(newRow[column] * (1 - percent / 100))
                        }
                    })
                    return newRow
                })
                return calculateTotals(updatedData)
            })
            return
        }

        if (action === 'insert') {
            // Handle row insertion
            const newId = Math.max(...rowData.map(row => row.id)) + 1
            const newRow = {
                id: newId,
                jobTitle: jobTitle,
                salaryPerMonth: 5000, // Default salary
                month1: 5000,
                month2: 5000,
                month3: 5000,
                month4: 5000,
                month5: 5000,
                month6: 5000
            }

            setRowData(prevData => {
                const newData = [...prevData.slice(0, -1), newRow, prevData[prevData.length - 1]]
                return calculateTotals(newData)
            })
            return
        }

        if (action === 'delete') {
            // Handle row deletion
            setRowData(prevData => {
                const filteredData = prevData.filter(row =>
                    row.jobTitle.toLowerCase() !== jobTitle.toLowerCase() && row.id !== 8
                ).concat([prevData[prevData.length - 1]]) // Keep the total row at the end
                return calculateTotals(filteredData)
            })
            return
        }

        setRowData(prevData => {
            const updatedData = prevData.map(row => {
                // Skip the total row
                if (row.id === 8) return row

                // Check if this row should be updated
                let shouldUpdate = false

                if (jobTitle) {
                    // Specific job title targeting (flexible matching)
                    const rowTitle = row.jobTitle.toLowerCase()
                    const targetTitle = jobTitle.toLowerCase()
                    shouldUpdate = rowTitle.includes(targetTitle) || targetTitle.includes(rowTitle)
                } else if (rows && rows.includes(row.id - 1)) {
                    // Row index targeting
                    shouldUpdate = true
                }

                if (shouldUpdate) {
                    const newRow = { ...row }

                    if (column === 'salaryPerMonth') {
                        if (action === 'increase') {
                            newRow.salaryPerMonth = Math.round(newRow.salaryPerMonth * (1 + percent / 100))
                        } else if (action === 'decrease') {
                            newRow.salaryPerMonth = Math.round(newRow.salaryPerMonth * (1 - percent / 100))
                        } else if (action === 'set') {
                            newRow.salaryPerMonth = value
                        }
                    } else if (column.startsWith('month')) {
                        if (action === 'increase') {
                            newRow[column] = Math.round(newRow[column] * (1 + percent / 100))
                        } else if (action === 'decrease') {
                            newRow[column] = Math.round(newRow[column] * (1 - percent / 100))
                        } else if (action === 'set') {
                            newRow[column] = value
                        }
                    }

                    return newRow
                }

                return row
            })

            // Calculate totals after changes
            return calculateTotals(updatedData)
        })
    }

    const selectCell = (rowId, column) => {
        setSelectedCells(prev => {
            const cellKey = `${rowId}-${column}`
            if (prev.includes(cellKey)) {
                return prev.filter(cell => cell !== cellKey)
            } else {
                return [...prev, cellKey]
            }
        })
    }

    const clearSelection = () => {
        setSelectedCells([])
    }

    return (
        <FinancialContext.Provider value={{
            rowData,
            updateRowData,
            applySalaryChange,
            selectedCells,
            selectCell,
            clearSelection
        }}>
            {children}
        </FinancialContext.Provider>
    )
}

export function useFinancial() {
    const context = useContext(FinancialContext)
    if (!context) {
        throw new Error('useFinancial must be used within a FinancialProvider')
    }
    return context
}
