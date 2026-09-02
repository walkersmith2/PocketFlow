import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';

import { useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

export const options = {
    responsive: true,
    animation: false,
    elements: {
    point: {
      radius: 0,       // Hides the dots in normal state
      hoverRadius: 0,  // Prevents dots from showing up on hover
    }
  }
};

function LineChart({ expenses, categories, dateFilter }) {

  const [areCategoryLinesVisible, setAreCategoryLinesVisible] = useState(true);
  
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
    COLOR_MAP[-1] = 'rgb(255, 255, 255)';

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
    
    datasets.push(
      {
        id: -1,
        label: 'All',
        data: [],
        borderColor: COLOR_MAP[-1],
        backgroundColor: COLOR_MAP[-1],
      }
    );

    // get labels array (based on dateFilter)
    if(dateFilter === "all") {
      // get min and max dates in expenses
      const maxDate = expenses.reduce((maxDate, expense) => {
         const curDate = new Date(expense.date + "T00:00:00").getTime();
         return Math.max(maxDate, curDate);
      }, Number.NEGATIVE_INFINITY);
      let minDate = expenses.reduce((minDate, expense) => {
         const curDate = new Date(expense.date + "T00:00:00").getTime();
         return Math.min(minDate, curDate);
      }, Number.POSITIVE_INFINITY);
      

      // fill labels array
      let numDays = Math.round((maxDate - minDate) / 86400000) + 1;
      if(numDays == 1) {
        minDate = maxDate - 86400000;
        numDays = numDays = Math.round((maxDate - minDate) / 86400000) + 1;
      }
      labels = Array.from({ length: numDays }, (_, index) => {
        const date = new Date(minDate + index * 86400000);
        return date.toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' });
      });

      labels.forEach((day, index) => {
        const currentDayExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date + "T00:00:00");
          const dayNumber = Math.round((expenseDate.getTime() - minDate) / 86400000); 
          return dayNumber === index;
        });
        const expensesTotal = currentDayExpenses.reduce((total, expense) => total + expense.amount, 0);
        if(areCategoryLinesVisible) {
          activeCategories.forEach((categoryId) => {
            const catTotal = currentDayExpenses.filter((expense) => expense.categoryId === categoryId).reduce((total, expense) => total + expense.amount, 0);
            datasets.find((dataset) => dataset.id === categoryId).data[index] = catTotal;
          })
        }
        datasets.find((dataset) => dataset.id === -1).data[index] = expensesTotal;
      });
    }
    if(dateFilter === "week") {
      labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      labels.forEach((day, index) => {
        const currentDayExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date + "T00:00:00");
          const dayOfWeek = expenseDate.getDay();
          return dayOfWeek === index;
        });
        const expensesTotal = currentDayExpenses.reduce((total, expense) => total + expense.amount, 0);
        if(areCategoryLinesVisible) {
          activeCategories.forEach((categoryId) => {
            const catTotal = currentDayExpenses.filter((expense) => expense.categoryId === categoryId).reduce((total, expense) => total + expense.amount, 0);
            datasets.find((dataset) => dataset.id === categoryId).data[index] = catTotal;
          })
        }
        datasets.find((dataset) => dataset.id === -1).data[index] = expensesTotal;
      });
    }
    if(dateFilter === "month") {
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
        datasets.find((dataset) => dataset.id === -1).data[index] = expensesTotal;
      });
    }
    if(dateFilter === "year") {
      const year = new Date().getFullYear();
      const daysInCurrentYear = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
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
        if(areCategoryLinesVisible) {
          activeCategories.forEach((categoryId) => {
            const catTotal = currentDayExpenses.filter((expense) => expense.categoryId === categoryId).reduce((total, expense) => total + expense.amount, 0);
            datasets.find((dataset) => dataset.id === categoryId).data[index] = catTotal;
          })
        }
        datasets.find((dataset) => dataset.id === -1).data[index] = expensesTotal;
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
