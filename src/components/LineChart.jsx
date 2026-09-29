import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

import { useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  annotationPlugin,
);

const rootStyles = window.getComputedStyle(document.body);
const lineColor = rootStyles.getPropertyValue('--text').trim();
const accentColor = rootStyles.getPropertyValue('--accent').trim();

function LineChart({ expenses, categories, dateFilter, timePeriodFilter, monthlyBudgets, monthlyBudgetsTotal }) {

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    animation: false,
    plugins: {
      legend: {
        position: 'top',
        display: true,
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
    elements: {
    point: {
      radius: 0,       // Hides the dots in normal state
      hoverRadius: 0,  // Prevents dots from showing up on hover
    }
  }
};

  const [areCategoryLinesVisible, setAreCategoryLinesVisible] = useState(false);

  function getDataObject() {
    if(expenses.length === 0) {
      return {labels: [], datasets: []};
    }

    if(timePeriodFilter === 'month' && monthlyBudgetsTotal > 0) {
      options.plugins['annotation'] = {
        annotations: {
            BudgetLine: {
              type: 'line',
              yMin: monthlyBudgets[0], // The starting Y-value for the horizontal line
              yMax: monthlyBudgets[0], // The ending Y-value (keep it the same for horizontal)
              borderColor: accentColor,
              borderWidth: 3,
              borderDash: [3, 6], // Optional: makes the line dashed
              label: {
                display: true,
                content: 'Budget',
                position: 'end',
                backgroundColor: accentColor,
              },
            },
        },
      };
    }

    const COLOR_MAP = {};
    categories.forEach((category) => {
      COLOR_MAP[category.id] = category.color;
    });
    COLOR_MAP[-1] = lineColor;

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
          borderWidth: 2,
        };
      });
    }
    
    datasets.push(
      {
        id: -1,
        label: 'Total',
        data: [],
        borderColor: COLOR_MAP[-1],
        backgroundColor: COLOR_MAP[-1],
        borderWidth: 2,
      }
    );

    if(timePeriodFilter === "month") {
      const daysInCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      labels = Array.from({ length: daysInCurrentMonth }, (_, index) => index + 1);
      let runningTotal = 0;
      labels.forEach((day, index) => {
        const currentDayExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date + "T00:00:00");
          const dayOfMonth = expenseDate.getDate();
          return dayOfMonth === day;
        });
        const expensesTotal = currentDayExpenses.reduce((total, expense) => total + expense.amount, 0);
        runningTotal += expensesTotal;
        datasets.find((dataset) => dataset.id === -1).data[index] = runningTotal;
      });
    }
    if(timePeriodFilter === "year") {
      const year = new Date().getFullYear();
      const daysInCurrentYear = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
      let runningTotal = 0;
      labels = Array.from({ length: daysInCurrentYear }, (_, index) => {
        const date = new Date(year, 0, index + 1);
        return date.toLocaleDateString('en-us', { month: 'short', day: 'numeric' });
      });
      labels.forEach((day, index) => {
        const currentDayExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date + "T00:00:00");
          const dayOfYear = Math.floor((expenseDate - new Date(year, 0, 1)) / 86400000);
          return dayOfYear === index;
        });
        const expensesTotal = currentDayExpenses.reduce((total, expense) => total + expense.amount, 0);
        runningTotal += expensesTotal;
        datasets.find((dataset) => dataset.id === -1).data[index] = runningTotal;
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
      {expenses.length > 0 ? 
      <Line data={getDataObject()} options={options} /> : <p>Nothing to show.</p>}
    </>
  );
}

export default LineChart;
