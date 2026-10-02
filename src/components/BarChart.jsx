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
import annotationPlugin from 'chartjs-plugin-annotation';

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import CheckIcon from '../assets/check-lg-icon.svg?react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
);

const rootStyles = window.getComputedStyle(document.body);
const underBudgetColor = rootStyles.getPropertyValue('--under-budget').trim();
const overBudgetColor = rootStyles.getPropertyValue('--over-budget').trim();
const budgetColor = '#969696';
const barBackgroundOpacity = '66';


const nearBudgetThreshold = 0.1;

function BarChart({ expenses, categories, dateFilter, timePeriodFilter, monthlyBudgets, monthlyBudgetsTotal, budgetRemaining, categoryBudgets }) {

  const options = {
    maintainAspectRatio: false,
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

  const [areCategoryLinesVisible, setAreCategoryLinesVisible] = useState(false);

  function handleChartToggleChange(e) {
    setAreCategoryLinesVisible(prev => !prev);
  }

  function getDataObject() {
    if(timePeriodFilter === 'month' && monthlyBudgetsTotal > 0) {
      options.plugins['annotation'] = {
        annotations: {
            BudgetLine: {
              type: 'line',
              yMin: monthlyBudgets[0], // The starting Y-value for the horizontal line
              yMax: monthlyBudgets[0], // The ending Y-value (keep it the same for horizontal)
              borderColor: budgetRemaining >= 0 ? underBudgetColor : overBudgetColor,
              borderWidth: 3,
              borderDash: [3, 6], // Optional: makes the line dashed
              label: {
                display: true,
                content: 'Budget',
                position: 'end',
                backgroundColor: budgetRemaining >= 0 ? underBudgetColor : overBudgetColor,
              },
            },
        },
      };
    }

    const COLOR_MAP = {};
    categories.forEach((category) => {
      COLOR_MAP[category.id] = category.color;
    });

    let labels = [];
    const activeCategoriesSet = new Set();
    expenses.forEach((expense) => activeCategoriesSet.add(expense.categoryId));
    const activeCategories = Array.from(activeCategoriesSet);
    let datasets = [];
    
    if(timePeriodFilter === 'year') {
      if(areCategoryLinesVisible) {
        datasets = categories.map((category) => {
          return {
            id: category.id,
            label: category.category,
            data: [],
            borderWidth: 1,
            borderColor: COLOR_MAP[category.id] || budgetColor,
            backgroundColor: COLOR_MAP[category.id] + barBackgroundOpacity || budgetColor + barBackgroundOpacity,
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
            backgroundColor: Array.from({ length: 12 }, (_, index) => underBudgetColor + barBackgroundOpacity),
            borderWidth: 1,
            grouped: false,
            barPercentage: 0.7,
          }
        );
        datasets.push(
          {
            id: 'budget-year',
            label: 'Budget',
            data: [],
            borderColor: budgetColor,
            backgroundColor: budgetColor + barBackgroundOpacity,
            borderWidth: 1,
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
          borderColor: [...categories.map((category) => COLOR_MAP[category.id] || budgetColor), underBudgetColor],
          backgroundColor: [...categories.map((category) => COLOR_MAP[category.id] + barBackgroundOpacity || budgetColor + barBackgroundOpacity), underBudgetColor + barBackgroundOpacity],
          borderWidth: 1,
          grouped: false,
          barPercentage: 0.7,
        }
      );
      datasets.push(
        {
          id: 'budget-month',
          label: 'Budget',
          data: [],
          borderColor: [...categories.map((category) => budgetColor), budgetColor],
          backgroundColor: [...categories.map((category) => budgetColor + barBackgroundOpacity), budgetColor + barBackgroundOpacity],
          borderWidth: 1,
          grouped: false,
          barPercentage: 0.9,
        }
      );
    }
    

    // get labels array (based on timePeriodFilter)
    if(timePeriodFilter === 'month') {
      const year = new Date(dateFilter).getFullYear();
      const month = new Date(dateFilter).getMonth();
      labels = [...categories.map((category) => category.category), 'Total'];
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
      categories.forEach((category) => {
        const categoryId = category.id;
        const catTotal = currentMonthExpenses.filter((expense) => expense.categoryId === categoryId).reduce((total, expense) => total + expense.amount, 0);
        // console.log(catTotal);
        const catBudget = (categoryBudgets.find((row) => row.categoryId === categoryId)?.amount || 0) * monthlyBudgetsTotal;
        totalDataset.data.push(catTotal);
        budgetDataset.data.push(catBudget);
      })
      datasets.find((dataset) => dataset.id === 'total-month').data.push(expensesTotal);
      datasets.find((dataset) => dataset.id === 'budget-month').data.push(monthlyBudgets[0]);

      if(monthlyBudgets[0] > 0 && expensesTotal > monthlyBudgets[0]) {
        totalDataset.backgroundColor[totalDataset.backgroundColor.length - 1] = overBudgetColor + barBackgroundOpacity;
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
          categories.forEach((category) => {
            const categoryId = category.id;
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
            totalDataset.backgroundColor[index] = overBudgetColor + barBackgroundOpacity;
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
        <label className='show-category-breakdown-checkbox'>
          <input type="checkbox" checked={areCategoryLinesVisible} onChange={handleChartToggleChange}></input>
          {areCategoryLinesVisible && <CheckIcon className='check-icon'/>}Show Category Breakdown
        </label>
      }
      
      <Bar key={`${timePeriodFilter}-${areCategoryLinesVisible}`} data={getDataObject()} options={options} />
    </>
  );
}

export default BarChart;