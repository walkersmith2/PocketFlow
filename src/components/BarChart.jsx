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

export const options = {
  responsive: true,
  animation: false,
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

function BarChart({ expenses, categories, dateFilter, timePeriodFilter }) {

  const rootStyles = window.getComputedStyle(document.body);
  const budgetColor = rootStyles.getPropertyValue('--text-h').trim() + '40';
  const [areCategoryLinesVisible, setAreCategoryLinesVisible] = useState(false);

  function handleChartToggleChange(e) {
    if(areCategoryLinesVisible) {
      setAreCategoryLinesVisible(false);
    }
    else {
      setAreCategoryLinesVisible(true);
    }
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
    
    if(areCategoryLinesVisible) {
      datasets = activeCategories.map((categoryId) => {
        return {
          id: categoryId,
          label: categories.find(category => category.id === categoryId).category,
          data: [],
          borderColor: COLOR_MAP[categoryId] || 'rgb(150, 150, 150)',
          backgroundColor: COLOR_MAP[categoryId] || 'rgb(150, 150, 150)',
        };
      });
    }
    else {
      datasets.push(
        {
          id: -1,
          label: 'actual',
          data: [],
          borderColor: COLOR_MAP[-1],
          backgroundColor: COLOR_MAP[-1],
          order: 1,
          grouped: false,
        }
      );
      datasets.push(
        {
          id: -1,
          label: 'budget',
          data: [5000,5000,5000,5000,5000,5000,5000,2000,2000,2000,2000,2000],
          borderColor: COLOR_MAP[-1] + '40',
          backgroundColor: COLOR_MAP[-1] + '40',
          order: 2,
          grouped: false,
        }
      );
      
    }
    

    // get labels array (based on timePeriodFilter)
    if(timePeriodFilter === 'month') {
      const year = dateFilter.getFullYear();
      const month = dateFilter.getMonth();
      const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
      labels = Array.from({ length: daysInCurrentMonth }, (_, index) => index + 1);
      labels.forEach((day, index) => {
        const currentDayExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date + "T00:00:00");
          return expenseDate.getDate() === day
          && expenseDate.getMonth() === month
          && expenseDate.getFullYear() === year;
        });
        const expensesTotal = currentDayExpenses.reduce((total, expense) => total + expense.amount, 0);
        if(areCategoryLinesVisible) {
          activeCategories.forEach((categoryId) => {
            const catTotal = currentDayExpenses.filter((expense) => expense.categoryId === categoryId).reduce((total, expense) => total + expense.amount, 0);
            datasets.find((dataset) => dataset.id === categoryId).data[index] = catTotal;
          })
        }
        else {
          datasets.find((dataset) => dataset.id === -1).data[index] = expensesTotal;
        }
      });
    }
    if(timePeriodFilter === 'year') {
      const year = new Date(dateFilter).getFullYear();
      // const daysInCurrentYear = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
      labels = Array.from({ length: 12 }, (_, index) => {
        const date = new Date(year, index, 1);
        return date.toLocaleDateString('en-us', { month: 'short' });
      });
      labels.forEach((month, index) => {
        const currentMonthExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date + "T00:00:00");
          const currentExpenseMonth = expenseDate.getMonth();
          const currentExpenseYear = expenseDate.getFullYear();
          return currentExpenseMonth === index && currentExpenseYear === year;
        });
        const expensesTotal = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
        if(areCategoryLinesVisible) {
          activeCategories.forEach((categoryId) => {
            const catTotal = currentMonthExpenses.filter((expense) => expense.categoryId === categoryId).reduce((total, expense) => total + expense.amount, 0);
            datasets.find((dataset) => dataset.id === categoryId).data[index] = catTotal;
          })
        }
        else {
          datasets.find((dataset) => dataset.id === -1).data[index] = expensesTotal;
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
      <label>
        <input type="checkbox" checked={areCategoryLinesVisible} onChange={handleChartToggleChange}></input>
        Show Category Breakdown
      </label>
      {expenses.length > 0 ? 
      <Bar data={getDataObject()} options={options} /> : <p>Nothing to show.</p>}
    </>
  );
}

export default BarChart;
