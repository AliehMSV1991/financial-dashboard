/**
 * Main Financial Project Page
 * 
 * Replicates the design from the reference image with:
 * - Dark theme layout
 * - Left sidebar navigation
 * - Top header with breadcrumbs
 * - Main content area with spreadsheet table
 */

'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { FinancialSpreadsheet } from '@/components/FinancialSpreadsheet';
import { AIAssistant } from '@/components/AIAssistant';
import { runLocalModel } from '@/utils/llm';

export default function Home() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

    // Financial data state
    const [activeTab, setActiveTab] = useState('salary');
    const [tableData, setTableData] = useState([
        { id: 1, jobTitle: 'Software Engineer', salaryPerMonth: '8000', hiringPlan: ['1', '1', '2', '2', '3', '3', '4', '4', '5', '5', '6', '6', '7'] },
        { id: 2, jobTitle: 'Product Manager', salaryPerMonth: '10000', hiringPlan: ['0', '1', '1', '1', '2', '2', '2', '3', '3', '3', '4', '4', '4'] },
        { id: 3, jobTitle: 'Marketing Specialist', salaryPerMonth: '6000', hiringPlan: ['1', '1', '1', '2', '2', '2', '3', '3', '3', '4', '4', '4', '5'] },
        { id: 4, jobTitle: 'Sales Representative', salaryPerMonth: '7000', hiringPlan: ['2', '2', '3', '3', '4', '4', '5', '5', '6', '6', '7', '7', '8'] },
        { id: 5, jobTitle: 'Data Analyst', salaryPerMonth: '7500', hiringPlan: ['0', '0', '1', '1', '1', '2', '2', '2', '3', '3', '3', '4', '4'] },
        { id: 6, jobTitle: 'UI/UX Designer', salaryPerMonth: '6500', hiringPlan: ['0', '1', '1', '1', '2', '2', '2', '3', '3', '3', '4', '4', '4'] },
        { id: 7, jobTitle: 'DevOps Engineer', salaryPerMonth: '9000', hiringPlan: ['0', '0', '0', '1', '1', '1', '2', '2', '2', '3', '3', '3', '4'] },
        { id: 8, jobTitle: 'Total', salaryPerMonth: 'Total', hiringPlan: ['4', '6', '9', '12', '15', '18', '21', '24', '27', '30', '33', '36', '39'] }
    ]);
    const [isInitialized, setIsInitialized] = useState({});

    // Excel-like functionality
    const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);
    const [selectedRange, setSelectedRange] = useState<{ start: { row: number, col: number }, end: { row: number, col: number } } | null>(null);
    const [formulaBar, setFormulaBar] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Data generation functions
    const generateInitialData = (category: string, userResponses: any) => {
        // Import financial data generator
        const { financialDataGenerator } = require('@/utils/financial-data-generator');
        financialDataGenerator.storeUserResponse(category, 'userResponses', userResponses);

        switch (category) {
            case 'salary':
                return financialDataGenerator.generateSalaryData(userResponses);
            case 'marketing':
                return financialDataGenerator.generateMarketingData(userResponses);
            case 'sales':
                return financialDataGenerator.generateSalesData(userResponses);
            case 'revenue':
                return financialDataGenerator.generateRevenueData(userResponses);
            default:
                return tableData;
        }
    };

    const initializeTabData = (tabName: string, userResponses: any) => {
        const newData = generateInitialData(tabName, userResponses);
        setTableData(newData);
        setIsInitialized(prev => ({ ...prev, [tabName]: true }));
        setActiveTab(tabName);
    };

    const handleDataGenerated = (category: string, data: any) => {
        initializeTabData(category, data);
    };

    // Helper function to get table structure
    const getTableStructure = () => {
        switch (activeTab) {
            case 'salary':
                return {
                    fields: ['jobTitle', 'salaryPerMonth', 'hiringPlan']
                };
            case 'marketing':
                return {
                    fields: ['channel', 'costPerLead', 'monthlyBudget']
                };
            case 'revenue':
                return {
                    fields: ['revenueStream', 'incomePerModel', 'users']
                };
            default:
                return {
                    fields: ['jobTitle', 'salaryPerMonth', 'hiringPlan']
                };
        }
    };

    // Excel-like functions
    const getCellReference = (row: number, col: number) => {
        const colLetter = String.fromCharCode(65 + col); // A, B, C, etc.
        return `${colLetter}${row + 1}`;
    };

    const getCellValue = (row: number, col: number) => {
        console.log(`getCellValue called: row=${row}, col=${col}`);

        if (row >= tableData.length) {
            console.log('Row out of bounds');
            return '';
        }

        const rowData = tableData[row];
        const tableStructure = getTableStructure();
        console.log('Row data:', rowData);
        console.log('Table structure:', tableStructure);

        if (col === 0) {
            const value = rowData[tableStructure.fields[0]] || '';
            console.log(`Col 0 (${tableStructure.fields[0]}): ${value}`);
            return value;
        }
        if (col === 1) {
            const value = rowData[tableStructure.fields[1]] || '';
            console.log(`Col 1 (${tableStructure.fields[1]}): ${value}`);
            return value;
        }
        if (col >= 2) {
            const monthlyData = rowData[tableStructure.fields[2]] || [];
            const value = monthlyData[col - 2] || '';
            console.log(`Col ${col} (${tableStructure.fields[2]}[${col - 2}]): ${value}`);
            return value;
        }
        return '';
    };

    const setCellValue = (row: number, col: number, value: string) => {
        const newData = [...tableData];
        const rowData = { ...newData[row] };
        const tableStructure = getTableStructure();

        if (col === 0) {
            rowData[tableStructure.fields[0]] = value;
        } else if (col === 1) {
            rowData[tableStructure.fields[1]] = value;
        } else if (col >= 2) {
            const monthlyData = [...(rowData[tableStructure.fields[2]] || [])];
            monthlyData[col - 2] = value;
            rowData[tableStructure.fields[2]] = monthlyData;
        }

        newData[row] = rowData;
        setTableData(newData);
    };

    const calculateFormula = (formula: string) => {
        console.log('calculateFormula called with:', formula);

        if (formula.startsWith('=')) {
            const expression = formula.substring(1);
            console.log('Expression after removing =:', expression);

            // Replace cell references with values
            const cellRefRegex = /([A-Z])(\d+)/g;
            let calculatedExpression = expression.replace(cellRefRegex, (match, col, row) => {
                const colIndex = col.charCodeAt(0) - 65;
                const rowIndex = parseInt(row) - 1;
                const value = getCellValue(rowIndex, colIndex);
                console.log(`Cell ${match} (row:${rowIndex}, col:${colIndex}) = ${value}`);
                return isNaN(parseFloat(value)) ? '0' : value;
            });

            console.log('Calculated expression:', calculatedExpression);

            try {
                // Safe math evaluation
                const result = Function('"use strict"; return (' + calculatedExpression + ')')();
                console.log('Result:', result);
                return isNaN(result) ? 'Error' : result.toString();
            } catch (error) {
                console.error('Formula calculation error:', error);
                return 'Error';
            }
        }
        return formula;
    };

    return (
        <div className="h-screen flex bg-gray-900 overflow-hidden">
            {/* Left Sidebar */}
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Top Header */}
                <TopHeader onAiAssistantToggle={() => setAiAssistantOpen(!aiAssistantOpen)} />

                {/* Main Content */}
                <div className="flex-1 bg-gray-800 overflow-hidden">
                    <FinancialSpreadsheet
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        tableData={tableData}
                        setTableData={setTableData}
                        isInitialized={isInitialized}
                        selectedCell={selectedCell}
                        setSelectedCell={setSelectedCell}
                        selectedRange={selectedRange}
                        setSelectedRange={setSelectedRange}
                        formulaBar={formulaBar}
                        setFormulaBar={setFormulaBar}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        getCellReference={getCellReference}
                        getCellValue={getCellValue}
                        setCellValue={setCellValue}
                        calculateFormula={calculateFormula}
                    />
                </div>
            </div>

            {/* AI Assistant Panel */}
            <AIAssistant
                isOpen={aiAssistantOpen}
                onClose={() => setAiAssistantOpen(false)}
                onDataGenerated={handleDataGenerated}
                runLocalModel={runLocalModel}
            />
        </div>
    );
}
