// Personal Expense Tracker Dashboard JavaScript

class ExpenseTracker {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.budgets = JSON.parse(localStorage.getItem('budgets')) || this.getDefaultBudgets();
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        
        this.incomeChart = null;
        this.expenseChart = null;
        this.budgetActualChart = null;
        
        this.init();
    }

    getDefaultBudgets() {
        return {
            income: 3000,
            expenses: {
                housing: 800,
                food: 400,
                transportation: 200,
                entertainment: 150,
                healthcare: 100,
                utilities: 150,
                other: 200
            },
            debt: 800,
            savings: 400
        };
    }

    init() {
        this.setupEventListeners();
        this.updateDashboard();
        this.initializeCharts();
        this.updateAllTables();
        
        // Set current date
        const today = new Date();
        const dateInput = document.getElementById('transactionDate');
        if (dateInput) {
            dateInput.value = today.toISOString().split('T')[0];
        }
        
        // Update month display
        this.updateMonthDisplay();
    }

    setupEventListeners() {
        // Navigation menu
        this.setupNavigation();
        
        // Transaction form
        const transactionForm = document.getElementById('transactionForm');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => this.addTransaction(e));
        }

        // Month/Year selectors
        const monthSelect = document.getElementById('monthSelect');
        const yearSelect = document.getElementById('yearSelect');
        
        if (monthSelect) {
            monthSelect.addEventListener('change', () => {
                this.currentMonth = parseInt(monthSelect.value);
                this.updateDashboard();
                this.updateAllTables();
                this.updateCharts();
            });
        }
        
        if (yearSelect) {
            yearSelect.addEventListener('change', () => {
                this.currentYear = parseInt(yearSelect.value);
                this.updateDashboard();
                this.updateAllTables();
                this.updateCharts();
            });
        }

        // Floating add button
        const addBtn = document.getElementById('addTransactionBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddTransactionModal());
        }

        // Export and Clear buttons
        const exportBtn = document.getElementById('exportBtn');
        const clearBtn = document.getElementById('clearDataBtn');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllData());
        }

        // Modal controls
        const modal = document.getElementById('addTransactionModal');
        const closeBtn = modal?.querySelector('.close');
        const cancelBtn = document.getElementById('cancelTransaction');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        // Transaction type change
        const transactionType = document.getElementById('transactionType');
        if (transactionType) {
            transactionType.addEventListener('change', () => this.updateCategoryOptions());
        }

        // Close modal on outside click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Transaction filters
        const transactionFilter = document.getElementById('transactionFilter');
        const transactionMonthFilter = document.getElementById('transactionMonthFilter');
        
        if (transactionFilter) {
            transactionFilter.addEventListener('change', () => this.updateTransactionsList());
        }
        
        if (transactionMonthFilter) {
            transactionMonthFilter.addEventListener('change', () => this.updateTransactionsList());
        }

        // Budget settings form
        const budgetForm = document.getElementById('budgetSettingsForm');
        if (budgetForm) {
            budgetForm.addEventListener('submit', (e) => this.updateBudgetSettings(e));
        }

        // Data management buttons
        const exportDataBtn = document.getElementById('exportDataBtn');
        const importDataBtn = document.getElementById('importDataBtn');
        const importFileInput = document.getElementById('importFileInput');
        const clearAllDataBtn = document.getElementById('clearAllDataBtn');

        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportData());
        }

        if (importDataBtn) {
            importDataBtn.addEventListener('click', () => importFileInput?.click());
        }

        if (importFileInput) {
            importFileInput.addEventListener('change', (e) => this.importData(e));
        }

        if (clearAllDataBtn) {
            clearAllDataBtn.addEventListener('click', () => this.clearAllData());
        }
    }

    setupNavigation() {
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('data-section');
                this.showSection(targetSection);
                
                // Update active state
                document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
                link.parentElement.classList.add('active');
            });
        });

        // Mobile menu toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Show dashboard by default
        this.showSection('dashboard');
        document.querySelector('[data-section="dashboard"]')?.parentElement.classList.add('active');
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update content based on section
        if (sectionName === 'transactions') {
            this.updateTransactionsList();
        } else if (sectionName === 'reports') {
            this.updateReportsSection();
        } else if (sectionName === 'settings') {
            this.loadBudgetSettings();
        }
    }

    updateTransactionsList() {
        const container = document.getElementById('transactionsList');
        if (!container) return;

        const filter = document.getElementById('transactionFilter')?.value || '';
        const monthFilter = document.getElementById('transactionMonthFilter')?.value || '';

        let filteredTransactions = [...this.transactions];

        // Filter by type
        if (filter) {
            filteredTransactions = filteredTransactions.filter(t => t.type === filter);
        }

        // Filter by month
        if (monthFilter) {
            const [year, month] = monthFilter.split('-');
            filteredTransactions = filteredTransactions.filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate.getFullYear() == year && 
                       (transactionDate.getMonth() + 1) == parseInt(month);
            });
        }

        // Sort by date (newest first)
        filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (filteredTransactions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 40px;">No transactions found.</p>';
            return;
        }

        container.innerHTML = filteredTransactions.map(transaction => {
            const date = new Date(transaction.date).toLocaleDateString();
            const typeIcons = {
                income: 'fas fa-plus',
                expense: 'fas fa-minus',
                bill: 'fas fa-file-invoice',
                debt: 'fas fa-credit-card'
            };

            return `
                <div class="transaction-item">
                    <div class="transaction-type ${transaction.type}">
                        <i class="${typeIcons[transaction.type]}"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.description}</h4>
                        <p>${transaction.category} • ${date}</p>
                    </div>
                    <div class="transaction-amount">
                        ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
                    </div>
                    <div class="transaction-actions">
                        <button class="btn btn-sm btn-outline" onclick="expenseTracker.editTransaction('${transaction.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline danger" onclick="expenseTracker.deleteTransaction('${transaction.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateReportsSection() {
        // Update budget performance
        this.updateBudgetPerformance();
        
        // Update charts in reports section if they exist
        const reportsIncomeChart = document.getElementById('reportsIncomeChart');
        const reportsExpenseChart = document.getElementById('reportsExpenseChart');
        
        if (reportsIncomeChart && this.incomeChart) {
            // Clone chart data to reports section
            this.updateCharts();
        }
    }

    updateBudgetPerformance() {
        const container = document.getElementById('budgetPerformance');
        if (!container) return;

        const totals = this.calculateTotals();
        const categories = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Healthcare', 'Other'];
        
        container.innerHTML = categories.map(category => {
            const spent = this.getExpensesByCategory(category);
            const budget = this.budgets[category.toLowerCase()] || 0;
            const percentage = budget > 0 ? (spent / budget) * 100 : 0;
            const remaining = budget - spent;

            return `
                <div class="budget-item">
                    <div class="budget-header">
                        <span class="category-name">${category}</span>
                        <span class="budget-amounts">$${spent.toFixed(2)} / $${budget.toFixed(2)}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%; background-color: ${percentage > 100 ? '#e74c3c' : percentage > 80 ? '#f39c12' : '#27ae60'}"></div>
                    </div>
                    <div class="budget-status ${remaining < 0 ? 'over-budget' : 'under-budget'}">
                        ${remaining >= 0 ? `$${remaining.toFixed(2)} remaining` : `$${Math.abs(remaining).toFixed(2)} over budget`}
                    </div>
                </div>
            `;
        }).join('');
    }

    getExpensesByCategory(category) {
        const currentMonthTransactions = this.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === this.currentMonth && 
                   transactionDate.getFullYear() === this.currentYear &&
                   (t.type === 'expense' || t.type === 'bill') &&
                   t.category === category;
        });

        return currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
    }

    loadBudgetSettings() {
        // Load current budget values into the form
        const budgets = this.budgets;
        
        const housingInput = document.getElementById('housingBudget');
        const foodInput = document.getElementById('foodBudget');
        const transportationInput = document.getElementById('transportationBudget');
        const entertainmentInput = document.getElementById('entertainmentBudget');
        const shoppingInput = document.getElementById('shoppingBudget');
        const healthcareInput = document.getElementById('healthcareBudget');
        const otherInput = document.getElementById('otherBudget');
        const billsInput = document.getElementById('billsBudget');
        const incomeInput = document.getElementById('incomeBudget');
        const debtInput = document.getElementById('debtBudget');
        const savingsInput = document.getElementById('savingsBudget');

        if (housingInput) housingInput.value = budgets.housing || 0;
        if (foodInput) foodInput.value = budgets.food || 0;
        if (transportationInput) transportationInput.value = budgets.transportation || 0;
        if (entertainmentInput) entertainmentInput.value = budgets.entertainment || 0;
        if (shoppingInput) shoppingInput.value = budgets.shopping || 0;
        if (healthcareInput) healthcareInput.value = budgets.healthcare || 0;
        if (otherInput) otherInput.value = budgets.other || 0;
        if (billsInput) billsInput.value = budgets.bills || 0;
        if (incomeInput) incomeInput.value = budgets.income || 0;
        if (debtInput) debtInput.value = budgets.debt || 0;
        if (savingsInput) savingsInput.value = budgets.savings || 0;
    }

    updateBudgetSettings(e) {
        e.preventDefault();
        
        // Get form values
        const housingBudget = parseFloat(document.getElementById('housingBudget')?.value) || 0;
        const foodBudget = parseFloat(document.getElementById('foodBudget')?.value) || 0;
        const transportationBudget = parseFloat(document.getElementById('transportationBudget')?.value) || 0;
        const entertainmentBudget = parseFloat(document.getElementById('entertainmentBudget')?.value) || 0;
        const shoppingBudget = parseFloat(document.getElementById('shoppingBudget')?.value) || 0;
        const healthcareBudget = parseFloat(document.getElementById('healthcareBudget')?.value) || 0;
        const otherBudget = parseFloat(document.getElementById('otherBudget')?.value) || 0;
        const billsBudget = parseFloat(document.getElementById('billsBudget')?.value) || 0;
        const incomeBudget = parseFloat(document.getElementById('incomeBudget')?.value) || 0;
        const debtBudget = parseFloat(document.getElementById('debtBudget')?.value) || 0;
        const savingsBudget = parseFloat(document.getElementById('savingsBudget')?.value) || 0;

        // Update budgets object
        this.budgets = {
            housing: housingBudget,
            food: foodBudget,
            transportation: transportationBudget,
            entertainment: entertainmentBudget,
            shopping: shoppingBudget,
            healthcare: healthcareBudget,
            other: otherBudget,
            bills: billsBudget,
            income: incomeBudget,
            debt: debtBudget,
            savings: savingsBudget
        };

        // Save to localStorage
        this.saveToStorage();
        
        // Update dashboard and charts
        this.updateDashboard();
        this.updateCharts();
        this.updateBudgetPerformance();
        
        // Show success notification
        this.showNotification('Budget settings updated successfully!', 'success');
    }

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                if (data.transactions) {
                    this.transactions = data.transactions;
                }
                
                if (data.budgets) {
                    this.budgets = data.budgets;
                }

                this.saveToStorage();
                this.updateDashboard();
                this.updateAllTables();
                this.updateCharts();
                this.loadBudgetSettings();
                
                this.showNotification('Data imported successfully!', 'success');
            } catch (error) {
                this.showNotification('Error importing data. Please check the file format.', 'error');
            }
        };
        
        reader.readAsText(file);
        e.target.value = ''; // Reset file input
    }

    updateMonthDisplay() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        const monthElement = document.getElementById('currentMonth');
        if (monthElement) {
            monthElement.textContent = months[this.currentMonth];
        }
        
        // Update selectors
        const monthSelect = document.getElementById('monthSelect');
        const yearSelect = document.getElementById('yearSelect');
        if (monthSelect) monthSelect.value = this.currentMonth;
        if (yearSelect) yearSelect.value = this.currentYear;
    }

    changeMonth(month) {
        this.currentMonth = month;
        this.updateMonthDisplay();
        this.updateDashboard();
        this.updateAllTables();
        this.updateCharts();
    }

    changeYear(year) {
        this.currentYear = year;
        this.updateMonthDisplay();
        this.updateDashboard();
        this.updateAllTables();
        this.updateCharts();
    }

    showAddTransactionModal() {
        const modal = document.getElementById('addTransactionModal');
        if (modal) {
            modal.style.display = 'block';
            this.updateCategoryOptions();
        }
    }

    updateCategoryOptions() {
        const typeSelect = document.getElementById('transactionType');
        const categorySelect = document.getElementById('transactionCategory');
        
        if (!typeSelect || !categorySelect) return;
        
        const type = typeSelect.value;
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        
        let options = [];
        switch(type) {
            case 'income':
                options = ['Salary', 'Freelance', 'Investment', 'Other Income'];
                break;
            case 'expense':
                options = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Healthcare', 'Utilities', 'Shopping', 'Other'];
                break;
            case 'bill':
                options = ['Internet', 'Phone', 'Electricity', 'Water', 'Gas', 'Insurance', 'Subscription'];
                break;
            case 'debt':
                options = ['Student Loan', 'Credit Card', 'Mortgage', 'Personal Loan'];
                break;
        }
        
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.toLowerCase().replace(' ', '_');
            optionElement.textContent = option;
            categorySelect.appendChild(optionElement);
        });
    }

    addTransaction(e) {
        e.preventDefault();
        
        const type = document.getElementById('transactionType').value;
        const category = document.getElementById('transactionCategory').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const description = document.getElementById('transactionDescription').value;
        const date = document.getElementById('transactionDate').value;
        
        const transaction = {
            id: Date.now().toString(),
            type,
            category,
            amount,
            description,
            date,
            createdAt: new Date().toISOString()
        };
        
        this.transactions.push(transaction);
        this.saveToStorage();
        this.updateDashboard();
        this.updateAllTables();
        this.updateCharts();
        this.closeModal();
        
        // Reset form
        document.getElementById('transactionForm').reset();
        document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
        
        this.showNotification('Transaction added successfully!', 'success');
    }

    closeModal() {
        const modal = document.getElementById('addTransactionModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    getCurrentMonthTransactions() {
        const currentMonthStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}`;
        return this.transactions.filter(t => t.date.startsWith(currentMonthStr));
    }

    getTransactionsByType(type) {
        const monthTransactions = this.getCurrentMonthTransactions();
        return monthTransactions.filter(t => t.type === type);
    }

    calculateTotals() {
        const income = this.getTransactionsByType('income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = this.getTransactionsByType('expense').reduce((sum, t) => sum + t.amount, 0);
        const bills = this.getTransactionsByType('bill').reduce((sum, t) => sum + t.amount, 0);
        const debt = this.getTransactionsByType('debt').reduce((sum, t) => sum + t.amount, 0);
        
        return { income, expenses, bills, debt };
    }

    updateDashboard() {
        const totals = this.calculateTotals();
        const totalExpensesAndDebt = totals.expenses + totals.bills + totals.debt;
        const leftToBudget = totals.income - totalExpensesAndDebt - this.budgets.savings;
        const leftToSpend = totals.income - totals.expenses - totals.bills - totals.debt;
        
        // Update summary cards
        const totalIncomeEl = document.getElementById('totalIncome');
        const totalExpensesEl = document.getElementById('totalExpenses');
        const leftToBudgetEl = document.getElementById('leftToBudget');
        const leftToSpendEl = document.getElementById('leftToSpend');
        const todaysAmountEl = document.getElementById('todaysAmount');
        
        if (totalIncomeEl) totalIncomeEl.textContent = `$${totals.income.toFixed(2)}`;
        if (totalExpensesEl) totalExpensesEl.textContent = `$${totalExpensesAndDebt.toFixed(2)}`;
        if (leftToBudgetEl) leftToBudgetEl.textContent = `$${leftToBudget.toFixed(2)}`;
        if (leftToSpendEl) leftToSpendEl.textContent = `$${leftToSpend.toFixed(2)}`;
        if (todaysAmountEl) {
            const today = new Date();
            todaysAmountEl.textContent = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        
        // Update cash flow summary table
        const actualIncomeEl = document.getElementById('actualIncome');
        const actualDebtEl = document.getElementById('actualDebt');
        const actualExpensesEl = document.getElementById('actualExpenses');
        const actualSavingsEl = document.getElementById('actualSavings');
        const differenceEl = document.getElementById('difference');
        
        if (actualIncomeEl) actualIncomeEl.textContent = `$ ${totals.income.toFixed(2)}`;
        if (actualDebtEl) actualDebtEl.textContent = `$ ${totals.debt.toFixed(2)}`;
        if (actualExpensesEl) actualExpensesEl.textContent = `$ ${(totals.expenses + totals.bills).toFixed(2)}`;
        if (actualSavingsEl) actualSavingsEl.textContent = `$ 0.00`; // Placeholder for savings
        if (differenceEl) differenceEl.textContent = `$ ${leftToSpend.toFixed(2)}`;
    }

    updateAllTables() {
        this.updateIncomeTable();
        this.updateBillsTable();
        this.updateExpensesTable();
        this.updateDebtTable();
        this.updateExpensesBreakdown();
    }

    updateIncomeTable() {
        const incomeTransactions = this.getTransactionsByType('income');
        const tbody = document.getElementById('incomeTableBody');
        if (!tbody) return;
        
        // Group by category
        const incomeByCategory = {};
        incomeTransactions.forEach(t => {
            if (!incomeByCategory[t.category]) {
                incomeByCategory[t.category] = 0;
            }
            incomeByCategory[t.category] += t.amount;
        });
        
        tbody.innerHTML = '';
        Object.entries(incomeByCategory).forEach(([category, actual]) => {
            const budget = category === 'salary' ? this.budgets.income : 0;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.charAt(0).toUpperCase() + category.slice(1)}</td>
                <td>$ ${budget.toFixed(2)}</td>
                <td>$ ${actual.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    updateBillsTable() {
        const billTransactions = this.getTransactionsByType('bill');
        const tbody = document.getElementById('billsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        billTransactions.forEach(t => {
            const row = document.createElement('tr');
            const dueDate = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            row.innerHTML = `
                <td>${t.description}</td>
                <td>${dueDate}</td>
                <td>$ ${t.amount.toFixed(2)}</td>
                <td>$ ${t.amount.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    updateExpensesTable() {
        const expenseTransactions = this.getTransactionsByType('expense');
        const tbody = document.getElementById('expensesDetailBody');
        if (!tbody) return;
        
        // Group by category
        const expensesByCategory = {};
        expenseTransactions.forEach(t => {
            if (!expensesByCategory[t.category]) {
                expensesByCategory[t.category] = 0;
            }
            expensesByCategory[t.category] += t.amount;
        });
        
        tbody.innerHTML = '';
        Object.entries(expensesByCategory).forEach(([category, actual]) => {
            const budget = this.budgets.expenses[category] || 0;
            const difference = budget - actual;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.charAt(0).toUpperCase() + category.slice(1)}</td>
                <td>$ ${budget.toFixed(2)}</td>
                <td>$ ${actual.toFixed(2)}</td>
                <td>$ ${difference.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    updateDebtTable() {
        const debtTransactions = this.getTransactionsByType('debt');
        const tbody = document.getElementById('debtTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        debtTransactions.forEach(t => {
            const row = document.createElement('tr');
            const dueDate = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            row.innerHTML = `
                <td>${t.description}</td>
                <td>${dueDate}</td>
                <td>$ ${t.amount.toFixed(2)}</td>
                <td>$ ${t.amount.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    updateExpensesBreakdown() {
        const expenseTransactions = this.getTransactionsByType('expense');
        const tbody = document.getElementById('expensesBreakdownBody');
        if (!tbody) return;
        
        // Group by category
        const expensesByCategory = {};
        expenseTransactions.forEach(t => {
            if (!expensesByCategory[t.category]) {
                expensesByCategory[t.category] = 0;
            }
            expensesByCategory[t.category] += t.amount;
        });
        
        tbody.innerHTML = '';
        Object.entries(expensesByCategory).forEach(([category, actual]) => {
            const budget = this.budgets.expenses[category] || 0;
            const difference = budget - actual;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.charAt(0).toUpperCase() + category.slice(1)}</td>
                <td>$ ${budget.toFixed(2)}</td>
                <td>$ ${actual.toFixed(2)}</td>
                <td>$ ${difference.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    initializeCharts() {
        // Income Chart (Pie)
        const incomeCtx = document.getElementById('incomeChart');
        if (incomeCtx) {
            this.incomeChart = new Chart(incomeCtx.getContext('2d'), {
                type: 'pie',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Expense Chart (Pie)
        const expenseCtx = document.getElementById('expenseChart');
        if (expenseCtx) {
            this.expenseChart = new Chart(expenseCtx.getContext('2d'), {
                type: 'pie',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Budget vs Actual Chart (Bar)
        const budgetCtx = document.getElementById('budgetActualChart');
        if (budgetCtx) {
            this.budgetActualChart = new Chart(budgetCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Income', 'Expenses', 'Bills', 'Debt'],
                    datasets: [{
                        label: 'Budget',
                        data: [],
                        backgroundColor: '#E8E8E8'
                    }, {
                        label: 'Actual',
                        data: [],
                        backgroundColor: '#4ECDC4'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        this.updateCharts();
    }

    updateCharts() {
        this.updateIncomeChart();
        this.updateExpenseChart();
        this.updateBudgetActualChart();
    }

    updateIncomeChart() {
        if (!this.incomeChart) return;
        
        const incomeTransactions = this.getTransactionsByType('income');
        const incomeByCategory = {};
        
        incomeTransactions.forEach(t => {
            incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
        });
        
        this.incomeChart.data.labels = Object.keys(incomeByCategory);
        this.incomeChart.data.datasets[0].data = Object.values(incomeByCategory);
        this.incomeChart.update();
    }

    updateExpenseChart() {
        if (!this.expenseChart) return;
        
        const expenseTransactions = this.getTransactionsByType('expense');
        const expensesByCategory = {};
        
        expenseTransactions.forEach(t => {
            expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
        });
        
        this.expenseChart.data.labels = Object.keys(expensesByCategory);
        this.expenseChart.data.datasets[0].data = Object.values(expensesByCategory);
        this.expenseChart.update();
    }

    updateBudgetActualChart() {
        if (!this.budgetActualChart) return;
        
        const totals = this.calculateTotals();
        
        const budgetData = [
            this.budgets.income,
            Object.values(this.budgets.expenses).reduce((sum, val) => sum + val, 0),
            0, // Bills budget (not defined in default budgets)
            this.budgets.debt
        ];
        
        const actualData = [
            totals.income,
            totals.expenses,
            totals.bills,
            totals.debt
        ];
        
        this.budgetActualChart.data.datasets[0].data = budgetData;
        this.budgetActualChart.data.datasets[1].data = actualData;
        this.budgetActualChart.update();
    }

    saveToStorage() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        localStorage.setItem('budgets', JSON.stringify(this.budgets));
    }

    exportData() {
        const dataStr = JSON.stringify({
            transactions: this.transactions,
            budgets: this.budgets,
            exportDate: new Date().toISOString()
        }, null, 2);
        
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `expense-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully!', 'success');
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            this.transactions = [];
            this.budgets = this.getDefaultBudgets();
            localStorage.removeItem('transactions');
            localStorage.removeItem('budgets');
            
            this.updateDashboard();
            this.updateAllTables();
            this.updateCharts();
            
            this.showNotification('All data cleared successfully!', 'success');
        }
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the expense tracker when the page loads
let expenseTracker;
document.addEventListener('DOMContentLoaded', () => {
    expenseTracker = new ExpenseTracker();
});
