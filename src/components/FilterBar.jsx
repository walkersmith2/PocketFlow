import { useState, useEffect } from 'react';

function FilterBar({ expenses, categories, visibleExpenses, setVisibleExpenses, dateFilter, setDateFilter, categoryFilter, setCategoryFilter, amountFilter, setAmountFilter}) {
  
  
  useEffect(() => {
    setCategoryFilter(prev => {
      const newSet = new Set(prev);
      categories.forEach(category => newSet.add(category.category));
      return newSet;
    });
  }, [categories]);
  
  const isAllChecked = categories.length > 0 && categories.every(category => categoryFilter.has(category.category));
  
  function handleDateFilterChange(e) {
    setDateFilter(e.target.value);
  }

  function handleAllOptionChange(e) {
    if(isAllChecked) {
      setCategoryFilter(new Set()); // deselect all
    }
    else {
      setCategoryFilter(new Set(categories.map((category) => category.category))); // select all
    }
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
          <input name="filter-category" type="checkbox" value="all" checked={isAllChecked} onChange={handleAllOptionChange}/>
          All
        </label>
        {categories.map((category) => (
          <label key={category.id}>
            <input name="filter-category" type="checkbox" value={category.category} checked={categoryFilter.has(category.category)} onChange={handleCategoryFilterChange}></input>
            {category.category}
          </label>
        ))}
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