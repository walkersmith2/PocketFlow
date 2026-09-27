import { backgroundColor } from '@mui/system';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const rootStyles = window.getComputedStyle(document.body);
const accentColor = rootStyles.getPropertyValue('--accent').trim();
const budgetOpacityHex = '88'; 

const underBudgetColor = accentColor;
const overBudgetColor = '#d73951';
const budgetColor = '#808080';

const nearBudgetThreshold = 0.1;

export const options = {
  responsive: true,
  animation: true,
  plugins: {
    legend: {
      display: false,
      position: 'top',
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
}

function BarChart({ expenses, categories, dateFilter, timePeriodFilter, monthlyBudgets }) {
  const [areCategoryLinesVisible, setAreCategoryLinesVisible] = useState(false);

  function handleChartToggleChange(e) {
    setAreCategoryLinesVisible(prev => !prev);
  }

  function getDataObject() {
    if(expenses.length === 0) {
      return {labels: [], datasets: []};
    }

    const COLOR_MAP = {};
    categories.forEach((category) => {
      COLOR_MAP[category.id] = category.color;
    });
    COLOR_MAP[-1] = accentColor;

    let labels = [];
    const activeCategoriesSet = new Set();
    expenses.forEach((expense) => activeCategoriesSet.add(expense.categoryId));
    const activeCategories = Array.from(activeCategoriesSet);
    let datasets = [];
    
    if(timePeriodFilter === 'year') {
      if(areCategoryLinesVisible) {
        datasets = activeCategories.map((categoryId) => {
          return {
            id: categoryId,
            label: categories.find(category => category.id === categoryId).category,
            data: [],
            borderColor: COLOR_MAP[categoryId] || 'rgb(150, 150, 150)',
            backgroundColor: COLOR_MAP[categoryId] || 'rgb(150, 150, 150)',
          }
        });
      }
      else {
        datasets.push(
          {
            id: 'total-year',
            label: 'Total',
            data: [],
            borderColor: Array.from({ length: 12 }, (_, index) => underBudgetColor),
            backgroundColor: Array.from({ length: 12 }, (_, index) => underBudgetColor),
            grouped: false,
            barPercentage: 0.7,
          }
        );
        datasets.push(
          {
            id: 'budget-year',
            label: 'Budget',
            data: [],
            borderColor: budgetColor + budgetOpacityHex,
            backgroundColor: budgetColor + budgetOpacityHex,
            order: 2,
            grouped: false,
            barPercentage: 0.9,
          }
        );
      }
    }
    else if(timePeriodFilter === 'month') {
      datasets.push(
        {
          id: 'total-month',
          label: 'Total',
          data: [],
          borderColor: [...activeCategories.map((categoryId) => COLOR_MAP[categoryId] || 'rgb(150, 150, 150)'), underBudgetColor],
          backgroundColor: [...activeCategories.map((categoryId) => COLOR_MAP[categoryId] + '66' || 'rgb(150, 150, 150)'), underBudgetColor],
          borderWidth: 2,
          grouped: false,
          barPercentage: 0.7,
        }
      );
      datasets.push(
        {
          id: 'budget-month',
          label: 'Budget',
          data: [],
          borderColor: [...activeCategories.map((categoryId) => COLOR_MAP[categoryId] + budgetOpacityHex || 'rgb(150, 150, 150)'), budgetColor + budgetOpacityHex],
          backgroundColor: [...activeCategories.map((categoryId) => COLOR_MAP[categoryId] + budgetOpacityHex || 'rgb(150, 150, 150)'), budgetColor + budgetOpacityHex],
          borderWidth: 2,
          grouped: false,
          barPercentage: 0.9,
        }
      );
    }
    

    // get labels array (based on timePeriodFilter)
    if(timePeriodFilter === 'month') {
      const year = new Date(dateFilter).getFullYear();
      const month = new Date(dateFilter).getMonth();
      labels = [...activeCategories.map((categoryId) => categories.find(category => category.id === categoryId).category), 'Total'];
      const currentMonthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date + "T00:00:00");
        const currentExpenseMonth = expenseDate.getMonth();
        const currentExpenseYear = expenseDate.getFullYear();
        return currentExpenseMonth === month
        && currentExpenseYear === year;
      });
      const expensesTotal = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
      

      const totalDataset = datasets.find((dataset) => dataset.id === 'total-month');
      const budgetDataset = datasets.find((dataset) => dataset.id === 'budget-month');
      activeCategories.forEach((categoryId) => {
        const catTotal = currentMonthExpenses.filter((expense) => expense.categoryId === categoryId).reduce((total, expense) => total + expense.amount, 0);
        totalDataset.data.push(catTotal);
        budgetDataset.data.push(0);
      })
      datasets.find((dataset) => dataset.id === 'total-month').data.push(expensesTotal);
      datasets.find((dataset) => dataset.id === 'budget-month').data.push(monthlyBudgets[0]);
      if(monthlyBudgets[0] > 0 && expensesTotal > monthlyBudgets[0]) {
        totalDataset.backgroundColor[totalDataset.backgroundColor.length - 1] = overBudgetColor;
        totalDataset.borderColor[totalDataset.borderColor.length - 1] = overBudgetColor;
      }
    }
    else if(timePeriodFilter === 'year') {
      const year = new Date(dateFilter).getFullYear();
      labels = Array.from({ length: 12 }, (_, index) => {
        const date = new Date(year, index, 1);
        return date.toLocaleDateString('en-us', { month: 'short' });
      });
      labels.forEach((_, index) => {
        const currentMonthExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date + "T00:00:00");
          const currentExpenseMonth = expenseDate.getMonth();
          const currentExpenseYear = expenseDate.getFullYear();
          return currentExpenseMonth === index
          && currentExpenseYear === year;
        });
        const expensesTotal = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
        if(areCategoryLinesVisible) {
          activeCategories.forEach((categoryId) => {
            const catTotal = currentMonthExpenses.filter((expense) => expense.categoryId === categoryId).reduce((total, expense) => total + expense.amount, 0);
            datasets.find((dataset) => dataset.id === categoryId).data[index] = catTotal;
          })
        }
        else {
          const totalDataset = datasets.find((dataset) => dataset.id === 'total-year');
          const budgetDataset = datasets.find((dataset) => dataset.id === 'budget-year');
          
          totalDataset.data[index] = expensesTotal;
          budgetDataset.data[index] = monthlyBudgets[index];
          
          if(monthlyBudgets[index] > 0 && expensesTotal > monthlyBudgets[index]) {
            totalDataset.backgroundColor[index] = overBudgetColor;
            totalDataset.borderColor[index] = overBudgetColor;
          }
        }
        
      
      });
    }

    const dataObject = {
      labels,
      datasets,
    };
    
    return dataObject;
  }
  return (
    <>
      {timePeriodFilter === 'year' && 
        <label>
          <input type="checkbox" checked={areCategoryLinesVisible} onChange={handleChartToggleChange}></input>
          Show Category Breakdown
        </label>
      }
      
      {expenses.length > 0 ? 
      <Bar key={`${timePeriodFilter}-${areCategoryLinesVisible}`} data={getDataObject()} options={options} /> : <p>Nothing to show.</p>}
    </>
  );
}

export default BarChart;