import { useState } from 'react';


function FilterBar({ expenses, visibleExpenses, setVisibleExpenses, dateFilter, setDateFilter, categoryFilter, setCategoryFilter, amountFilter, setAmountFilter}) {

  function handleDateFilterChange(e) {
    setDateFilter(e.target.value);
  }

  function handleCategoryFilterChange(e) {
    setCategoryFilter(prev => {
      const newSet = new Set(prev);
      if(newSet.has(e.target.value)) {
        newSet.delete(e.target.value);
      }
      else {
        newSet.add(e.target.value);
      }
      console.log(newSet);
      return newSet;
    });
  }

  function handleAmountFilterChange(e) {
    setAmountFilter(parseFloat(e.target.value));
  }

  return (
    <form className="filter-form">
      <fieldset>
        <h2>Filter by date range</h2>
        <label>
          <input name="filter-date-range" type="radio" value="week" checked={dateFilter === "week"} onChange={handleDateFilterChange}></input>
          Current Week
        </label>
        <label>
          <input name="filter-date-range" type="radio" value="month" checked={dateFilter === "month"} onChange={handleDateFilterChange}></input>
          Current Month
        </label>
        <label>
          <input name="filter-date-range" type="radio" value="year" checked={dateFilter === "year"} onChange={handleDateFilterChange}></input>
          Current Year
        </label>
        <label>
          <input name="filter-date-range" type="radio"  value="all" checked={dateFilter === "all"} onChange={handleDateFilterChange}></input>
          All Time
        </label>
      </fieldset>
      <fieldset>
        <h2>Filter by category</h2>
        <label>
          <input name="filter-category" type="checkbox" value="Food & Drink" checked={categoryFilter.has("Food & Drink")} onChange={handleCategoryFilterChange}></input>
          Food & Drink
        </label>
        <label>
          <input name="filter-category" type="checkbox" value="Entertainment" checked={categoryFilter.has("Entertainment")} onChange={handleCategoryFilterChange}></input>
          Entertainment
        </label>
        <label>
          <input name="filter-category" type="checkbox" value="Rent/Utilities" checked={categoryFilter.has("Rent/Utilities")} onChange={handleCategoryFilterChange}></input>
          Rent/Utilities
        </label>
      </fieldset>
      <fieldset>
        <h2>Filter by amount</h2>
        <label>
          <input name="filter-amount" type="radio"  value="10" checked={amountFilter === 10} onChange={handleAmountFilterChange}></input>
          Under $10
        </label>
        <label>
          <input name="filter-amount" type="radio"  value="100" checked={amountFilter === 100} onChange={handleAmountFilterChange}></input>
          Under $100
        </label>
        <label>
          <input name="filter-amount" type="radio"  value="1000" checked={amountFilter === 1000} onChange={handleAmountFilterChange}></input>
          Under $1000
        </label>
        <label>
          <input name="filter-amount" type="radio"  value="1000000" checked={amountFilter === 1000000} onChange={handleAmountFilterChange}></input>
          All
        </label>
        
      </fieldset>
    </form>
  )
}

export default FilterBar;