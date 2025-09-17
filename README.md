# Personal Expense Tracker Dashboard

A comprehensive web-based expense tracking application with an organized, spreadsheet-like interface for managing personal finances.

## Features

### 📊 Dashboard Overview
- **Monthly/Yearly Navigation**: Switch between different time periods
- **Summary Cards**: Real-time display of total income, expenses, budget remaining, and spending totals
- **Visual Analytics**: Interactive charts showing spending breakdowns and trends
- **Organized Grid Layout**: Clean, professional interface matching spreadsheet design

### 💰 Financial Tracking
- **Income Management**: Track salary, freelance, investments, and other income sources
- **Expense Categories**: Organize spending by Housing, Food, Transportation, Entertainment, Healthcare, Utilities, Shopping, and Other
- **Bill Tracking**: Monitor recurring bills with due dates
- **Debt Management**: Track loan payments, credit cards, and other debt obligations

### 📈 Visual Analytics
- **Income Breakdown Chart**: Pie chart showing income sources
- **Expense Distribution Chart**: Visual representation of spending by category
- **Budget vs Actual Chart**: Bar chart comparing planned vs actual spending
- **Real-time Updates**: All charts update automatically when data changes

### 🔧 Core Functionality
- **Add Transactions**: Quick transaction entry via floating add button
- **Data Persistence**: All data saved locally in browser storage
- **Export/Import**: Backup and restore data in JSON format
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Installation
1. Download the three main files:
   - `expense-dashboard.html`
   - `styles.css`
   - `script.js`

2. Place all files in the same directory

3. Open `expense-dashboard.html` in your web browser

### First Use
1. The dashboard will load with default budget settings
2. Click the floating **+** button to add your first transaction
3. Select transaction type (Income, Expense, Bill, or Debt)
4. Choose appropriate category and enter details
5. All sections will update automatically

## User Interface

### Header Section
- **Month Display**: Shows current viewing period
- **Period Controls**: Dropdown selectors for month and year
- **Summary Cards**: 
  - Total Income
  - Total Expenses, Bills & Debt
  - Left to Budget
  - Left to Spend
  - Today's Date

### Main Grid Layout

#### Setup Section
- Month and year selection
- Currency settings
- Basic configuration controls

#### Cash Flow Summary
- Budget vs Actual comparison table
- Income, Debt, Expenses, and Savings tracking
- Difference calculations

#### Breakdown Charts
- Visual pie charts for income and expense distribution
- Real-time updates based on transaction data

#### Detailed Tables
- **Income Table**: Sources with budget vs actual amounts
- **Bills Table**: Recurring bills with due dates and amounts
- **Expenses Table**: Category breakdown with budget comparisons
- **Debt Table**: Debt payments with due dates
- **Expenses Breakdown**: Summary view of spending categories

#### Budget vs Actual Chart
- Bar chart comparing planned vs actual spending
- Visual representation of financial performance

## Transaction Management

### Adding Transactions
1. Click the floating **+** button (bottom right)
2. Select transaction type:
   - **Income**: Salary, Freelance, Investment, Other Income
   - **Expense**: Housing, Food, Transportation, Entertainment, Healthcare, Utilities, Shopping, Other
   - **Bill**: Internet, Phone, Electricity, Water, Gas, Insurance, Subscription
   - **Debt**: Student Loan, Credit Card, Mortgage, Personal Loan

3. Fill in required fields:
   - Category (auto-populated based on type)
   - Amount
   - Description
   - Date

4. Click "Add Transaction"

### Data Categories

#### Income Categories
- Salary
- Freelance
- Investment
- Other Income

#### Expense Categories
- Housing
- Food
- Transportation
- Entertainment
- Healthcare
- Utilities
- Shopping
- Other

#### Bill Categories
- Internet
- Phone
- Electricity
- Water
- Gas
- Insurance
- Subscription

#### Debt Categories
- Student Loan
- Credit Card
- Mortgage
- Personal Loan

## Data Management

### Local Storage
- All data is stored locally in your browser
- No external servers or accounts required
- Data persists between sessions

### Export Data
1. Click the "Export" button (top right)
2. Downloads a JSON file with all your data
3. File named: `expense-data-YYYY-MM-DD.json`

### Import Data
- Currently manual import (paste data into browser console)
- Future versions will include import functionality

### Clear All Data
1. Click "Clear All" button (top right)
2. Confirm deletion in popup dialog
3. Resets to default budget settings

## Budget Management

### Default Budget Settings
- **Income**: $3,000
- **Expenses**:
  - Housing: $800
  - Food: $400
  - Transportation: $200
  - Entertainment: $150
  - Healthcare: $100
  - Utilities: $150
  - Other: $200
- **Debt**: $800
- **Savings**: $400

### Budget Calculations
- **Left to Budget**: Income - (Expenses + Bills + Debt + Savings)
- **Left to Spend**: Income - (Expenses + Bills + Debt)
- **Difference**: Budget vs Actual variance

## Technical Details

### Files Structure
```
expense-dashboard.html    # Main HTML file
styles.css               # CSS styling
script.js               # JavaScript functionality
```

### Dependencies
- **Chart.js**: For interactive charts and graphs
- **Font Awesome**: For icons and visual elements
- **Modern Browser**: Supports ES6+ JavaScript features

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Data Format
```json
{
  "transactions": [
    {
      "id": "timestamp",
      "type": "expense|income|bill|debt",
      "category": "category_name",
      "amount": 0.00,
      "description": "Transaction description",
      "date": "YYYY-MM-DD",
      "createdAt": "ISO timestamp"
    }
  ],
  "budgets": {
    "income": 3000,
    "expenses": {
      "housing": 800,
      "food": 400,
      // ... other categories
    },
    "debt": 800,
    "savings": 400
  }
}
```

## Responsive Design

### Desktop (1200px+)
- Full grid layout with all sections visible
- Optimal viewing experience

### Tablet (768px - 1200px)
- Condensed 2-column grid
- Maintained functionality

### Mobile (< 768px)
- Single column layout
- Stacked sections
- Touch-friendly controls
- Smaller floating add button

## Troubleshooting

### Common Issues

#### Data Not Saving
- Ensure browser allows local storage
- Check if in private/incognito mode
- Clear browser cache and reload

#### Charts Not Displaying
- Verify internet connection (Chart.js CDN)
- Check browser console for errors
- Ensure JavaScript is enabled

#### Layout Issues
- Clear browser cache
- Check CSS file is loading properly
- Verify all files are in same directory

### Performance Tips
- Export data regularly for backup
- Clear old data periodically
- Use latest browser version

## Future Enhancements

### Planned Features
- Import functionality for data restoration
- Custom budget categories
- Recurring transaction templates
- Advanced reporting and analytics
- Multi-currency support
- Data synchronization across devices

### Customization Options
- Theme selection
- Custom color schemes
- Configurable dashboard layout
- Additional chart types

## Support

### Getting Help
- Check browser console for error messages
- Verify all files are properly loaded
- Ensure modern browser compatibility

### Data Recovery
- Use exported JSON files for data restoration
- Browser developer tools can access localStorage data
- Regular exports recommended for data safety

---

**Version**: 1.0  
**Last Updated**: September 2025  
**License**: Personal Use  
**Author**: Cascade AI Assistant
