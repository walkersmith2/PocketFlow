import { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react';

import CaretLeftIcon from '../assets/caret-left-fill.svg?react';
import CaretRightIcon from '../assets/caret-right-fill.svg?react';
import ClearIcon from '../assets/x.svg?react';

import DecimalInput from './DecimalInput';

const rootStyles = window.getComputedStyle(document.body);
const underBudgetColor = rootStyles.getPropertyValue('--under-budget').trim();

function AddBudgetComponent({ categories, monthlyBudgets, addBudget, categoryBudgets, addCategoryBudgets, dateFilter, timePeriodFilter, setIsAddCategoryFormVisible, setIsAddBudgetComponentOpen, onClose }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [categoryPercentages, setCategoryPercentages] = useState({});
  const [progressBarOuterWidth, setProgressBarOuterWidth] = useState(0);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const isMonth = timePeriodFilter === 'month';
    setTotalBudget(isMonth ? Number(monthlyBudgets[0]) || 0 : 0);
    if(isMonth) {
      setCategoryPercentages(
        Object.fromEntries(
          categories.map((c) => {
            const row = isMonth
              ? categoryBudgets.find((r) => String(r.categoryId) === String(c.id))
              : null;
            return [c.id, Number(row?.amount) || 0];
          })
        )
      );
    }
  }, [dateFilter, timePeriodFilter, monthlyBudgets, categoryBudgets, categories]);

  useLayoutEffect(() => {
    if(progressBarRef.current) {
      setProgressBarOuterWidth(progressBarRef.current.offsetWidth);
    }
  }, []);

  const allotedPercentage = useMemo(() => {
    return Object.values(categoryPercentages).reduce((total, budget) => total + budget, 0);
  }, [categoryPercentages]);

  const allotedAmount = totalBudget > 0 ? allotedPercentage * totalBudget : 0;
  const remainingPercentage = totalBudget > 0 ? 1 - allotedPercentage : 0;
  const remainingAmount = Math.max(remainingPercentage * totalBudget, 0);

  function handleBudgetChange(id, value) {
    setCategoryPercentages((prev) => ({
      ...prev,
      [id]: Number(Math.min(value, remainingPercentage + categoryPercentages[id])) || 0,
    }));
  }

  function handleClearAll() {
    setCategoryPercentages((prev) => 
      Object.fromEntries(Object.keys(prev).map(key => [key, 0]))
    );
  }

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

  async function handleSubmit(e) {
    e.preventDefault();
    await addBudget(dateFilter, totalBudget);
    await addCategoryBudgets(dateFilter, categoryPercentages);
    onClose();
  }

  return (
    <div className='add-budget-component'>
      <div className='component-heading-container'>
        <h2 className='component-heading'>Edit Budget</h2>
        <div className='date-div'>
          <div className='date-heading-div'>
            <h2 className='date-heading'>{timePeriodFilter == 'month' ? dateFilter.toLocaleDateString('en-us', { month: 'long', year: 'numeric' }) : dateFilter.getFullYear()}</h2>
          </div>
          {isCurrentMonthOrYear() && <p className='date-subheading'>{`Days left in ${timePeriodFilter}: ${getDaysLeftInTimePeriod()}`}</p>}
        </div>
      </div>
      {timePeriodFilter === 'year' && <p className='note-p'><b>Note:</b> You are currently setting a monthly budget for <b>all</b> months of the selected year. Clicking <b>Save</b> will overwrite any previous budgets set.</p>}
      <div className='budget-total-table'>
        <h3>1. Set Total Monthly Budget</h3>
        <div className='scrollable-table'>
          <table>
            <thead>
              <tr>
                <th>Total</th>
                <th>Allotted</th>
                <th>Remaining</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>$<DecimalInput value={totalBudget} onValueChange={(v) => setTotalBudget(v)} /></td>
                <td>${allotedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({(allotedPercentage * 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%)</td>
                <td>${remainingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({(remainingPercentage * 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%)</td>
                <td><div ref={progressBarRef} className='budget-progress-outer-bar'><div className='budget-progress-inner-bar' style={{ width: Math.floor(progressBarOuterWidth * allotedPercentage) }} ></div></div></td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
      <div className='budget-breakdown-table'>
        <div className='table-heading'>
          <h3>2. Set Per Category Budgets</h3>
          <button onClick={handleClearAll} disabled={allotedPercentage === 0} ><ClearIcon /> Clear All</button>
        </div>
        <div className='scrollable-table'>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Budget</th>
                <th>% Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const fraction = categoryPercentages[category.id] ?? 0;
                const percentage = fraction * 100;
                const budget = totalBudget > 0 ? fraction * totalBudget : 0;
                return (
                  <tr key={category.id}>
                    <td><span className='category-span'><div className='category-color-label' style={{ backgroundColor: category.color }}></div>{category.category}</span></td>
                    <td>$<DecimalInput value={budget} onValueChange={(v) => handleBudgetChange(category.id, totalBudget > 0 ? v / totalBudget : 0)} /></td>
                    <td><DecimalInput value={percentage} onValueChange={(v) => handleBudgetChange(category.id, v / 100)} />%</td>
                    {/* <td><input type='number' value={Math.max(percentage.toFixed(2), 0)} onChange={(e) => handleBudgetChange(category.id, e.target.value / 100)} />%</td> */}
                    <td><input type='range' min={0} max={100} step={0.01} value={percentage} onChange={(e) => handleBudgetChange(category.id, e.target.value / 100)} /></td>
                  </tr>
                );
              })}
              <tr>
                <td><button className='category-span' onClick={(e) => {e.preventDefault(); setIsAddCategoryFormVisible(true);}}>+ Add Category</button></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className='submit-btn-div'>
        <button onClick={(e) => handleSubmit(e)} >Save</button>
        <button onClick={onClose} >Cancel</button>
      </div>
    </div>
  )
}

export default AddBudgetComponent;