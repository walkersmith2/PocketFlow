import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
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

function LineChart({ expenses, dateFilter }) {

  function getDataObject() {
    if(expenses.length === 0) {
      return {labels: [], datasets: []};
    }
    let labels = [];
    let data = [];
    // get labels array (based on dateFilter)
    if(dateFilter === "all") {
      // get min and max dates in expenses
      const minDate = expenses.reduce((minDate, expense) => {
         const curDate = new Date(expense.date + "T00:00:00").getTime();
         return Math.min(minDate, curDate);
      }, Number.POSITIVE_INFINITY);
      const maxDate = expenses.reduce((maxDate, expense) => {
         const curDate = new Date(expense.date + "T00:00:00").getTime();
         return Math.max(maxDate, curDate);
      }, Number.NEGATIVE_INFINITY);

      console.log(new Date(minDate), new Date(maxDate));
      // fill labels array
      const numDays = Math.round((maxDate - minDate) / 86400000) + 1;
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
        data[index] = expensesTotal;
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
        data[index] = expensesTotal;
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
        data[index] = expensesTotal;
      });
    }
    if(dateFilter === "year") {
      const year = new Date().getFullYear();
      console.log("year: ", year);
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
        data[index] = expensesTotal;
      });
    }

    const dataObject = {
      labels,
      datasets: [
        {
          label: 'All Expenses',
          data: data,
          borderColor: 'rgb(255, 255, 255)',
          backgroundColor: 'rgba(255, 255, 255)',
        },
      ],
    };
    
    return dataObject;
  }

  return <Line data={getDataObject()} options={options} />;
}

export default LineChart;
