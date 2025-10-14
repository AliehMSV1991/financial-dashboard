// Financial Data Generator for Initial Setup
// This module generates realistic financial data based on user responses

export class FinancialDataGenerator {
    constructor() {
        this.userResponses = {}
        this.generatedData = {
            marketing: [],
            sales: [],
            revenue: [],
            salary: [],
            currentCost: [],
            equipment: []
        }
    }

    // Store user responses for data generation
    storeUserResponse(category, question, answer) {
        if (!this.userResponses[category]) {
            this.userResponses[category] = {}
        }
        this.userResponses[category][question] = answer
    }

    // Generate Marketing data based on user responses
    generateMarketingData(userResponses = null) {
        const responses = userResponses || this.userResponses.marketing || {}
        const companySize = responses.companySize || 'startup'
        const industry = responses.industry || 'technology'
        const budget = responses.marketingBudget || 10000
        const marketingChannels = responses.marketingChannels || 'digital, content, events'
        const targetCAC = responses.targetCAC || 300

        // Marketing table structure with 12 months
        const marketingData = [
            {
                id: 1,
                category: 'Social Network',
                description: 'Social media advertising and campaigns',
                month1: Math.round(budget * 0.2),
                month2: Math.round(budget * 0.22),
                month3: Math.round(budget * 0.24),
                month4: Math.round(budget * 0.26),
                month5: Math.round(budget * 0.28),
                month6: Math.round(budget * 0.30),
                month7: Math.round(budget * 0.32),
                month8: Math.round(budget * 0.34),
                month9: Math.round(budget * 0.36),
                month10: Math.round(budget * 0.38),
                month11: Math.round(budget * 0.40),
                month12: Math.round(budget * 0.42)
            },
            {
                id: 2,
                category: 'SEO & Google Ads',
                description: 'Search engine optimization and Google advertising',
                month1: 0,
                month2: Math.round(budget * 0.15),
                month3: Math.round(budget * 0.15),
                month4: Math.round(budget * 0.15),
                month5: Math.round(budget * 0.15),
                month6: Math.round(budget * 0.15),
                month7: Math.round(budget * 0.18),
                month8: Math.round(budget * 0.20),
                month9: Math.round(budget * 0.22),
                month10: Math.round(budget * 0.24),
                month11: Math.round(budget * 0.26),
                month12: Math.round(budget * 0.28)
            },
            {
                id: 3,
                category: 'Events',
                description: 'Trade shows, conferences, and networking events',
                month1: 0,
                month2: 0,
                month3: 0,
                month4: 0,
                month5: 0,
                month6: Math.round(budget * 0.1),
                month7: 0,
                month8: 0,
                month9: 0,
                month10: Math.round(budget * 0.1),
                month11: 0,
                month12: 0
            },
            {
                id: 4,
                category: 'SMS & Email',
                description: 'Email marketing and SMS campaigns',
                month1: Math.round(budget * 0.03),
                month2: Math.round(budget * 0.035),
                month3: Math.round(budget * 0.04),
                month4: Math.round(budget * 0.045),
                month5: Math.round(budget * 0.05),
                month6: Math.round(budget * 0.055),
                month7: Math.round(budget * 0.06),
                month8: Math.round(budget * 0.065),
                month9: Math.round(budget * 0.07),
                month10: Math.round(budget * 0.075),
                month11: Math.round(budget * 0.08),
                month12: Math.round(budget * 0.085)
            },
            {
                id: 5,
                category: 'Referral & Coupons',
                description: 'Referral programs and discount campaigns',
                month1: 0,
                month2: Math.round(budget * 0.05),
                month3: Math.round(budget * 0.08),
                month4: Math.round(budget * 0.1),
                month5: Math.round(budget * 0.12),
                month6: Math.round(budget * 0.15),
                month7: Math.round(budget * 0.18),
                month8: Math.round(budget * 0.2),
                month9: Math.round(budget * 0.22),
                month10: Math.round(budget * 0.24),
                month11: Math.round(budget * 0.26),
                month12: Math.round(budget * 0.28)
            }
        ]

        // Add total row
        const totalRow = {
            id: 6,
            category: 'Total in month',
            description: 'Total Marketing Cost per Month',
            month1: 0,
            month2: 0,
            month3: 0,
            month4: 0,
            month5: 0,
            month6: 0,
            month7: 0,
            month8: 0,
            month9: 0,
            month10: 0,
            month11: 0,
            month12: 0
        }

        // Calculate totals for each month
        for (let month = 1; month <= 12; month++) {
            const monthKey = `month${month}`
            totalRow[monthKey] = marketingData.reduce((sum, item) => sum + (item[monthKey] || 0), 0)
        }

        marketingData.push(totalRow)

        return marketingData
    }

    // Generate Sales data based on user responses
    generateSalesData(userResponses = null) {
        const responses = userResponses || this.userResponses.sales || {}
        const revenueTarget = responses.revenueTarget || 100000
        const salesTeamSize = responses.salesTeamSize || 3
        const averageDealSize = responses.averageDealSize || 5000
        const conversionRate = responses.conversionRate || 15
        const salesCycleLength = responses.salesCycleLength || 4

        // Sales table structure with 12 months
        const salesData = [
            {
                id: 1,
                category: 'Sales Team Salaries',
                description: 'Base salaries for sales team',
                month1: salesTeamSize * 3000,
                month2: salesTeamSize * 3000,
                month3: salesTeamSize * 3000,
                month4: salesTeamSize * 3000,
                month5: salesTeamSize * 3000,
                month6: salesTeamSize * 3000,
                month7: salesTeamSize * 3000,
                month8: salesTeamSize * 3000,
                month9: salesTeamSize * 3000,
                month10: salesTeamSize * 3000,
                month11: salesTeamSize * 3000,
                month12: salesTeamSize * 3000
            },
            {
                id: 2,
                category: 'Sales Commissions',
                description: 'Commission payments (10% of revenue)',
                month1: Math.round(revenueTarget * 0.1 / 12),
                month2: Math.round(revenueTarget * 0.1 / 12),
                month3: Math.round(revenueTarget * 0.1 / 12),
                month4: Math.round(revenueTarget * 0.1 / 12),
                month5: Math.round(revenueTarget * 0.1 / 12),
                month6: Math.round(revenueTarget * 0.1 / 12),
                month7: Math.round(revenueTarget * 0.1 / 12),
                month8: Math.round(revenueTarget * 0.1 / 12),
                month9: Math.round(revenueTarget * 0.1 / 12),
                month10: Math.round(revenueTarget * 0.1 / 12),
                month11: Math.round(revenueTarget * 0.1 / 12),
                month12: Math.round(revenueTarget * 0.1 / 12)
            },
            {
                id: 3,
                category: 'Sales Tools & CRM',
                description: 'CRM software and sales tools',
                month1: salesTeamSize * 100,
                month2: salesTeamSize * 100,
                month3: salesTeamSize * 100,
                month4: salesTeamSize * 100,
                month5: salesTeamSize * 100,
                month6: salesTeamSize * 100,
                month7: salesTeamSize * 100,
                month8: salesTeamSize * 100,
                month9: salesTeamSize * 100,
                month10: salesTeamSize * 100,
                month11: salesTeamSize * 100,
                month12: salesTeamSize * 100
            },
            {
                id: 4,
                category: 'Sales Training',
                description: 'Training and development programs',
                month1: Math.round(salesTeamSize * 200),
                month2: Math.round(salesTeamSize * 200),
                month3: Math.round(salesTeamSize * 200),
                month4: Math.round(salesTeamSize * 200),
                month5: Math.round(salesTeamSize * 200),
                month6: Math.round(salesTeamSize * 200),
                month7: Math.round(salesTeamSize * 200),
                month8: Math.round(salesTeamSize * 200),
                month9: Math.round(salesTeamSize * 200),
                month10: Math.round(salesTeamSize * 200),
                month11: Math.round(salesTeamSize * 200),
                month12: Math.round(salesTeamSize * 200)
            },
            {
                id: 5,
                category: 'Sales Events & Conferences',
                description: 'Sales events and networking',
                month1: 0,
                month2: 0,
                month3: Math.round(salesTeamSize * 500),
                month4: 0,
                month5: 0,
                month6: Math.round(salesTeamSize * 500),
                month7: 0,
                month8: 0,
                month9: Math.round(salesTeamSize * 500),
                month10: 0,
                month11: 0,
                month12: Math.round(salesTeamSize * 500)
            }
        ]

        // Add total row
        const totalRow = {
            id: 6,
            category: 'Total in month',
            description: 'Total Sales Cost per Month',
            month1: 0,
            month2: 0,
            month3: 0,
            month4: 0,
            month5: 0,
            month6: 0,
            month7: 0,
            month8: 0,
            month9: 0,
            month10: 0,
            month11: 0,
            month12: 0
        }

        // Calculate totals for each month
        for (let month = 1; month <= 12; month++) {
            const monthKey = `month${month}`
            totalRow[monthKey] = salesData.reduce((sum, item) => sum + (item[monthKey] || 0), 0)
        }

        salesData.push(totalRow)

        return salesData
    }

    // Generate Revenue Assumptions data
    generateRevenueData(userResponses = null) {
        const responses = userResponses || this.userResponses.revenue || {}
        const monthlyRevenue = responses.monthlyRevenue || 50000
        const growthRate = responses.growthRate || 0.1 // 10% monthly growth
        const revenueStreams = responses.revenueStreams || '70% products, 20% services, 10% subscriptions'
        const customerAcquisitionCost = responses.customerAcquisitionCost || 500
        const customerLifetimeValue = responses.customerLifetimeValue || 2000

        // Parse revenue streams
        const productPercentage = 0.7
        const servicePercentage = 0.2
        const subscriptionPercentage = 0.1

        // Revenue table structure with 12 months
        const revenueData = [
            {
                id: 1,
                category: 'Product Sales',
                description: 'Revenue from product sales',
                month1: Math.round(monthlyRevenue * productPercentage),
                month2: Math.round(monthlyRevenue * productPercentage * (1 + growthRate)),
                month3: Math.round(monthlyRevenue * productPercentage * Math.pow(1 + growthRate, 2)),
                month4: Math.round(monthlyRevenue * productPercentage * Math.pow(1 + growthRate, 3)),
                month5: Math.round(monthlyRevenue * productPercentage * Math.pow(1 + growthRate, 4)),
                month6: Math.round(monthlyRevenue * productPercentage * Math.pow(1 + growthRate, 5)),
                month7: Math.round(monthlyRevenue * productPercentage * Math.pow(1 + growthRate, 6)),
                month8: Math.round(monthlyRevenue * productPercentage * Math.pow(1 + growthRate, 7)),
                month9: Math.round(monthlyRevenue * productPercentage * Math.pow(1 + growthRate, 8)),
                month10: Math.round(monthlyRevenue * productPercentage * Math.pow(1 + growthRate, 9)),
                month11: Math.round(monthlyRevenue * productPercentage * Math.pow(1 + growthRate, 10)),
                month12: Math.round(monthlyRevenue * productPercentage * Math.pow(1 + growthRate, 11))
            },
            {
                id: 2,
                category: 'Service Revenue',
                description: 'Revenue from services and consulting',
                month1: Math.round(monthlyRevenue * 0.2),
                month2: Math.round(monthlyRevenue * 0.2 * (1 + growthRate)),
                month3: Math.round(monthlyRevenue * 0.2 * Math.pow(1 + growthRate, 2)),
                month4: Math.round(monthlyRevenue * 0.2 * Math.pow(1 + growthRate, 3)),
                month5: Math.round(monthlyRevenue * 0.2 * Math.pow(1 + growthRate, 4)),
                month6: Math.round(monthlyRevenue * 0.2 * Math.pow(1 + growthRate, 5)),
                month7: Math.round(monthlyRevenue * 0.2 * Math.pow(1 + growthRate, 6)),
                month8: Math.round(monthlyRevenue * 0.2 * Math.pow(1 + growthRate, 7)),
                month9: Math.round(monthlyRevenue * 0.2 * Math.pow(1 + growthRate, 8)),
                month10: Math.round(monthlyRevenue * 0.2 * Math.pow(1 + growthRate, 9)),
                month11: Math.round(monthlyRevenue * 0.2 * Math.pow(1 + growthRate, 10)),
                month12: Math.round(monthlyRevenue * 0.2 * Math.pow(1 + growthRate, 11))
            },
            {
                id: 3,
                category: 'Subscription Revenue',
                description: 'Recurring subscription revenue',
                month1: Math.round(monthlyRevenue * 0.1),
                month2: Math.round(monthlyRevenue * 0.1 * (1 + growthRate)),
                month3: Math.round(monthlyRevenue * 0.1 * Math.pow(1 + growthRate, 2)),
                month4: Math.round(monthlyRevenue * 0.1 * Math.pow(1 + growthRate, 3)),
                month5: Math.round(monthlyRevenue * 0.1 * Math.pow(1 + growthRate, 4)),
                month6: Math.round(monthlyRevenue * 0.1 * Math.pow(1 + growthRate, 5)),
                month7: Math.round(monthlyRevenue * 0.1 * Math.pow(1 + growthRate, 6)),
                month8: Math.round(monthlyRevenue * 0.1 * Math.pow(1 + growthRate, 7)),
                month9: Math.round(monthlyRevenue * 0.1 * Math.pow(1 + growthRate, 8)),
                month10: Math.round(monthlyRevenue * 0.1 * Math.pow(1 + growthRate, 9)),
                month11: Math.round(monthlyRevenue * 0.1 * Math.pow(1 + growthRate, 10)),
                month12: Math.round(monthlyRevenue * 0.1 * Math.pow(1 + growthRate, 11))
            }
        ]

        // Add total row
        const totalRow = {
            id: 4,
            category: 'Total in month',
            description: 'Total Revenue per Month',
            month1: 0,
            month2: 0,
            month3: 0,
            month4: 0,
            month5: 0,
            month6: 0,
            month7: 0,
            month8: 0,
            month9: 0,
            month10: 0,
            month11: 0,
            month12: 0
        }

        // Calculate totals for each month
        for (let month = 1; month <= 12; month++) {
            const monthKey = `month${month}`
            totalRow[monthKey] = revenueData.reduce((sum, item) => sum + (item[monthKey] || 0), 0)
        }

        revenueData.push(totalRow)

        return revenueData
    }

    // Generate questions for each category
    getQuestionsForCategory(category) {
        const questions = {
            marketing: [
                "What's your company size? (startup, small, medium, large)",
                "What industry are you in? (technology, healthcare, finance, etc.)",
                "What's your monthly marketing budget?",
                "What marketing channels do you use? (digital, content, events, PR)"
            ],
            sales: [
                "What's your target monthly revenue?",
                "How many sales team members do you have?",
                "What's your average deal size?",
                "What's your sales cycle length? (weeks)"
            ],
            revenue: [
                "What's your current monthly revenue?",
                "What's your expected monthly growth rate? (%)",
                "What are your main revenue streams? (products, services, subscriptions)",
                "What's your customer acquisition cost?"
            ]
        }

        return questions[category] || []
    }

    // Generate Salary data based on user responses
    generateSalaryData(userResponses = null) {
        // Use provided userResponses or fallback to stored responses
        const responses = userResponses || this.userResponses || {}
        console.log('🔍 All responses:', responses)
        console.log('🔍 Salary responses:', responses)

        const employeeCount = responses.employeeCount || 5
        const averageSalary = responses.averageSalary || 5000
        const jobTitles = responses.jobTitles || 'CEO, CTO, Developer, Manager, Support'
        const salaryGrowthRate = responses.salaryGrowthRate || 5
        const bonusPercentage = responses.bonusPercentage || 10

        console.log('🔍 Parsed values:', {
            employeeCount,
            averageSalary,
            jobTitles,
            salaryGrowthRate,
            bonusPercentage
        })

        // Parse job titles - handle comma-separated list
        const titles = jobTitles.split(',').map(title => title.trim()).filter(title => title.length > 0)
        console.log('🔍 Parsed job titles:', titles)

        // Salary table structure with 12 months
        const salaryData = titles.map((title, index) => {
            // Use actual user responses to calculate salaries
            // Create salary hierarchy based on position with more realistic multipliers
            let salaryMultiplier = 1
            if (title.toLowerCase().includes('ceo') || title.toLowerCase().includes('founder')) {
                salaryMultiplier = 1.2  // 20% more than average
            } else if (title.toLowerCase().includes('cto') || title.toLowerCase().includes('cfo')) {
                salaryMultiplier = 1.1  // 10% more than average
            } else if (title.toLowerCase().includes('manager') || title.toLowerCase().includes('director')) {
                salaryMultiplier = 1.05  // 5% more than average
            } else if (title.toLowerCase().includes('developer') || title.toLowerCase().includes('engineer') ||
                title.toLowerCase().includes('frontend') || title.toLowerCase().includes('backend')) {
                salaryMultiplier = 1.0  // Average salary
            } else if (title.toLowerCase().includes('ui') || title.toLowerCase().includes('ux') ||
                title.toLowerCase().includes('designer')) {
                salaryMultiplier = 0.95  // 5% less than average
            } else if (title.toLowerCase().includes('support') || title.toLowerCase().includes('qa')) {
                salaryMultiplier = 0.9  // 10% less than average
            }

            const baseSalary = Math.round(averageSalary * salaryMultiplier)
            const bonus = Math.round(baseSalary * bonusPercentage / 100)
            const totalSalary = baseSalary + bonus

            return {
                id: index + 1,
                jobTitle: title,
                salaryPerMonth: totalSalary,
                month1: totalSalary,
                month2: totalSalary,
                month3: totalSalary,
                month4: totalSalary,
                month5: totalSalary,
                month6: totalSalary,
                month7: totalSalary,
                month8: totalSalary,
                month9: totalSalary,
                month10: totalSalary,
                month11: totalSalary,
                month12: totalSalary
            }
        })

        // Add total row
        const totalRow = {
            id: titles.length + 1,
            jobTitle: 'Total',
            salaryPerMonth: 0,
            month1: 0,
            month2: 0,
            month3: 0,
            month4: 0,
            month5: 0,
            month6: 0,
            month7: 0,
            month8: 0,
            month9: 0,
            month10: 0,
            month11: 0,
            month12: 0
        }

        // Calculate totals for each month
        for (let month = 1; month <= 12; month++) {
            const monthKey = `month${month}`
            totalRow[monthKey] = salaryData.reduce((sum, item) => sum + (item[monthKey] || 0), 0)
        }

        // Calculate total salary per month
        totalRow.salaryPerMonth = totalRow.month1

        salaryData.push(totalRow)

        return salaryData
    }

    // Generate all data based on stored responses
    generateAllData() {
        return {
            salary: this.generateSalaryData(),
            marketing: this.generateMarketingData(),
            sales: this.generateSalesData(),
            revenue: this.generateRevenueData()
        }
    }
}

// Export singleton instance
export const financialDataGenerator = new FinancialDataGenerator()
