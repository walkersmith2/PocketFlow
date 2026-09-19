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
  animations: false,
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
      grid: {
        display: false,
      },
    },
  },
}

function BarChart({ expenses, categories, dateFilter, timePeriodFilter }) {

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
          label: 'All categories',
          data: [],
          borderColor: COLOR_MAP[-1],
          backgroundColor: COLOR_MAP[-1],
        }
      );
    }
    

    // get labels array (based on timePeriodFilter)
    if(timePeriodFilter === "month") {
      const daysInCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      labels = Array.from({ length: daysInCurrentMonth }, (_, index) => index + 1);
      labels.forEach((day, index) => {
        const currentDayExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date + "T00:00:00");
          const dayOfMonth = expenseDate.getDate();
          return dayOfMonth === day;
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
    if(timePeriodFilter === "year") {
      const year = new Date().getFullYear();
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
          console.log("date: ", expenseDate.getMonth(), " ", expenseDate.getFullYear());
          return currentExpenseMonth === index && currentExpenseYear === year;
        });
        const expensesTotal = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
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
