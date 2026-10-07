import { useState, useEffect, useRef, useLayoutEffect } from 'react';

import CaretDownIcon from '../assets/caret-down-fill.svg?react';
import CaretLeftIcon from '../assets/caret-left-fill.svg?react';
import CaretRightIcon from '../assets/caret-right-fill.svg?react';
import EditIcon from '../assets/edit-icon.svg?react';
import ResetIcon from '../assets/arrow-clockwise.svg?react';
import CalendarIcon from '../assets/calendar-range.svg?react';
import InfoIcon from '../assets/info-lg.svg?react';

const rootStyles = window.getComputedStyle(document.body);
const underBudgetColor = rootStyles.getPropertyValue('--under-budget').trim();
const overBudgetColor = rootStyles.getPropertyValue('--over-budget').trim();

function BudgetComponent({ visibleExpenses, categories, categoryBudgets, monthlyBudgetsTotal, budgetRemaining, timePeriodFilter, setTimePeriodFilter, dateFilter, setDateFilter, onEditBudget }) {
  
  const [progressBarOuterWidth, setProgressBarOuterWidth] = useState(0);
  const [isBreakdownVisible, setIsBreakdownVisible] = useState(false);
  const progressBarRef = useRef(null);

  useLayoutEffect(() => {
    if(progressBarRef.current) {
      setProgressBarOuterWidth(progressBarRef.current.offsetWidth);
    }
  }, []);
  
  function isCurrentMonthOrYear() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    if(timePeriodFilter === 'year') {
      return currentYear === dateFilter.getFullYear();
    }
    else if(timePeriodFilter === 'month') {
      return currentYear === dateFilter.getFullYear() && currentMonth === dateFilter.getMonth();
    }
  }

  function getDaysLeftInTimePeriod() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    if(timePeriodFilter === 'year') {
      const endOfYear = new Date(currentYear, 11, 31);
      const diff = endOfYear.getTime() - today.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    else if(timePeriodFilter === 'month') {
      return daysInCurrentMonth - dateFilter.getDate();
    }
  }

  function handleHover() {
    console.log('hover');
  }

  return (
    <div className='budget-component'>
      <div className='component-heading-container'>
        <div className='component-heading-div'>
          <h2 className='component-heading'>Total Spent: <span className={`total-spent-span ${budgetRemaining >= 0 ? 'under-budget-text' : 'over-budget-text'}`}>${visibleExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> of ${monthlyBudgetsTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
          <p className='total-spent-subheading'>{timePeriodFilter === 'month' && (<>You are <span className={budgetRemaining >= 0 ? 'under-budget-text' : 'over-budget-text'}>${Math.abs(budgetRemaining).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> {budgetRemaining >= 0 ? 'under' : 'over'} budget for this month.</>)}</p>
          <button title='Edit Budget' className='edit-budget-btn' onClick={onEditBudget}><EditIcon className='edit-icon' />Edit Budget</button>
        </div>
        <div>
          <div className='date-div'>
            <div className='date-heading-div'>
              <h2 className='date-heading'>{timePeriodFilter == 'month' ? dateFilter.toLocaleDateString('en-us', { month: 'long', year: 'numeric' }) : dateFilter.getFullYear()}</h2>
              <p className='date-subheading'>{isCurrentMonthOrYear() ? `Days left in ${timePeriodFilter}: ${getDaysLeftInTimePeriod()}` : ''}</p>
            </div>
            <div className='date-button-div'>
              <label title='Change time period between month and year' className='time-period-filter-toggle'>
                <input type='checkbox' checked={timePeriodFilter === 'year'} onChange={(e) => e.target.checked ? setTimePeriodFilter('year') : setTimePeriodFilter('month')}/>
                <CalendarIcon className='calendar-icon'/><span className='text-span'>{timePeriodFilter === 'month' ? 'Month' : 'Year'}</span>
              </label>
              <div className='arrow-btns-div'>
                <button title='Previous month/year' type='button' onClick={() => setDateFilter(prev => timePeriodFilter === 'month' ? new Date(prev.getFullYear(), prev.getMonth() - 1, prev.getDate()) : new Date(prev.getFullYear() - 1, prev.getMonth(), prev.getDate()))}><CaretLeftIcon /></button>
                <button title='Return to current month/year' className='reset-btn' type='button' disabled={isCurrentMonthOrYear()} onClick={() => setDateFilter(prev => timePeriodFilter === 'month' ? new Date(new Date().getFullYear(), new Date().getMonth(), prev.getDate()) : new Date(new Date().getFullYear(), prev.getMonth(), prev.getDate()))}><ResetIcon className='reset-icon' /></button>
                <button title='Next month/year' type='button' onClick={() => setDateFilter(prev => timePeriodFilter === 'month' ? new Date(prev.getFullYear(), prev.getMonth() + 1, prev.getDate()) : new Date(prev.getFullYear() + 1, prev.getMonth(), prev.getDate()))}><CaretRightIcon /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='budget-breakdown-table'>
        <h3 className='heading'><span className='text-span'>Budget Breakdown </span><button onClick={() => setIsBreakdownVisible(prev => !prev)}><CaretDownIcon className={`caret-down-icon ${isBreakdownVisible ? 'expanded' : ''}`} /></button></h3>
        <div className='scrollable-table'>
          <table className={isBreakdownVisible ? 'expanded' : ''}>
            <thead>
                <tr>
                  <th>Category</th>
                  <th>Budget</th>
                  <th>Spent</th>
                  <th>Remaining</th>
                  <th>% Used</th>
                  <th></th>
                </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const fraction = Number(categoryBudgets.find((row) => row.categoryId === category.id)?.amount) || 0;
                const budget = fraction * (monthlyBudgetsTotal || 0);
                const spent = visibleExpenses.filter((expense) => expense.categoryId === category.id).reduce((total, expense) => total + expense.amount, 0) || 0;
                const remaining = budget - spent;
                const percentUsed = budget > 0 ? (spent / budget) * 100 : 0;

                return (
                  <tr key={category.id} className={percentUsed > 100 ? 'over-budget-bg' : ''}>
                    <td><span className='category-span'><div className='category-color-label' style={{ backgroundColor: category.color }}></div>{category.category}</span></td>
                    <td>${budget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>${spent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className={remaining >= 0 ? 'under-budget-text' : 'over-budget-text'}>
                      {`${remaining < 0 ? '-' : ''}$${Math.abs(remaining).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                    </td>
                    <td>{percentUsed.toFixed(2)}%</td>
                    <td><div className='budget-progress-outer-bar'><div className='budget-progress-inner-bar' style={{ width: `${Math.min(percentUsed, 100)}%`, backgroundColor: percentUsed > 100 ? overBudgetColor : underBudgetColor }} ></div></div></td>
                  </tr> 
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BudgetComponent;