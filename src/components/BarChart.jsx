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
const budgetOpacityHex = '40'; 

export const options = {
  responsive: true,
  animation: true,
  plugins: {
    legend: {
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
            isBudget: false,
            data: [],
            borderColor: COLOR_MAP[categoryId] || 'rgb(150, 150, 150)',
            backgroundColor: COLOR_MAP[categoryId] || 'rgb(150, 150, 150)',
          }
        });
      }
      else {
        datasets.push(
          {
            id: -1,
            label: 'Total',
            data: [],
            isBudget: false,
            borderColor: COLOR_MAP[-1],
            backgroundColor: COLOR_MAP[-1],
            grouped: true,
            barPercentage: 0.7,
          }
        );
        datasets.push(
          {
            id: -1,
            label: 'Budget',
            isBudget: true,
            data: [],
            borderColor: COLOR_MAP[-1] + budgetOpacityHex,
            backgroundColor: COLOR_MAP[-1] + budgetOpacityHex,
            order: 2,
            grouped: false,
            barPercentage: 0.9,
          }
        );
      }
    }
    else if(timePeriodFilter === 'month') {
      datasets = activeCategories.map((categoryId) => {
        return {
          id: categoryId,
          label: categories.find(category => category.id === categoryId).category,
          isBudget: false,
          data: [],
          borderColor: COLOR_MAP[categoryId] || 'rgb(150, 150, 150)',
          backgroundColor: COLOR_MAP[categoryId] + '66' || 'rgb(150, 150, 150)',
          borderWidth: 2,
          barPercentage: 0.9,
        }
      });
      datasets.push(
        {
          id: -1,
          label: 'Total',
          isBudget: false,
          data: [],
          borderColor: COLOR_MAP[-1],
          backgroundColor: COLOR_MAP[-1] + '66',
          borderWidth: 2,
          grouped: true,
          barPercentage: 0.9,
        }
      );
    }
    

    // get labels array (based on timePeriodFilter)
    if(timePeriodFilter === 'month') {
      const year = new Date(dateFilter).getFullYear();
      const month = new Date(dateFilter).getMonth();
      labels = [''];
      const currentMonthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date + "T00:00:00");
        const currentExpenseMonth = expenseDate.getMonth();
        const currentExpenseYear = expenseDate.getFullYear();
        return currentExpenseMonth === month
        && currentExpenseYear === year;
      });
      const expensesTotal = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
      
      activeCategories.forEach((categoryId) => {
        const catTotal = currentMonthExpenses.filter((expense) => expense.categoryId === categoryId).reduce((total, expense) => total + expense.amount, 0);
        datasets.find((dataset) => dataset.id === categoryId).data = [catTotal];
        datasets.find((dataset) => dataset.id === -1).data = [expensesTotal];
      })
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
          datasets.find((dataset) => dataset.id === -1 && dataset.isBudget === false).data[index] = expensesTotal;
          datasets.find((dataset) => dataset.id === -1 && dataset.isBudget === true).data[index] = monthlyBudgets[index];
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
      <Bar data={getDataObject()} options={options} /> : <p>Nothing to show.</p>}
    </>
  );
}

export default BarChart;