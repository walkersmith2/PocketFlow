import { useState } from 'react';
import Dropdown from './Dropdown';

import FilterIcon from '../assets/funnel-fill.svg?react';
import XIcon from '../assets/x-lg.svg?react';

const dateBody = [
  {
    value: 'week',
    text: 'This Week',
  },
  {
    value: 'month',
    text: 'This Month',
  },
  {
    value: 'year',
    text: 'This Year',
  },
  {
    value: 'all',
    text: 'All Time',
  },
];

const amountBody = [
  {
    value: 10,
    text: 'Under $10',
  },
  {
    value: 100,
    text: 'Under $100',
  },
  {
    value: 1000,
    text: 'Under $1000',
  },
  {
    value: 1000000,
    text: 'All',
  },
];

function FilterBar({ categories, dateFilter, setDateFilter, categoryFilter, setCategoryFilter, amountFilter, setAmountFilter }) {
  const [activeDropdown, setActiveDropdown] = useState('');
  const isAllChecked = categories.length > 0 && categories.every(category => categoryFilter.has(category.id));
  const resetActive = dateFilter !== 'all' || amountFilter !== 1000000 || !isAllChecked;
  console.log(resetActive);
  const categoriesBody = [
    {
      value: 'all',
      text: 'All',
    }, ...
    (categories ?? []).map((category) => ({
      value: category.id,
      text: category.category,
    }))
  ];
  

  function handleDateFilterChange(e) {
    setDateFilter(e.target.value);
  }

  function handleAllOptionChange(e) {
    if(isAllChecked) {
      setCategoryFilter(new Set()); // deselect all
    }
    else {
      setCategoryFilter(new Set(categories.map((category) => category.id))); // select all
    }
  }

  function handleCategoryFilterChange(e) {
    const id = Number(e.target.value);
    setCategoryFilter(prev => {
      const newSet = new Set(prev);
      if(newSet.has(id)) {
        newSet.delete(id);
      }
      else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  function handleAmountFilterChange(e) {
    setAmountFilter(parseFloat(e.target.value));
  }

  function handleReset(e) {
    e.preventDefault();
    setActiveDropdown('');
    setDateFilter('all');
    setAmountFilter(1000000);
    setCategoryFilter(new Set(categories.map((category) => category.id)));
  }

  return (
    <div className="filter-bar">
      <FilterIcon className="filter-icon"/>
      <Dropdown name='date' header={dateFilter === 'all' ? 'Date' : `This ${dateFilter}`} type='radio' body={dateBody} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} filter={dateFilter} handleFilterChange={handleDateFilterChange} />
      <Dropdown name='amount' header={amountFilter === 1000000 ? 'Amount' : `Under $${amountFilter}`} type='radio' body={amountBody} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} filter={amountFilter} handleFilterChange={handleAmountFilterChange} />
      <Dropdown name='category' header={isAllChecked ? 'Category' : (categoryFilter.size == 1 ? `${categoryFilter.size} Category Selected` : `${categoryFilter.size} Categories Selected`)} type='checkbox' body={categoriesBody} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} filter={categoryFilter} handleFilterChange={handleCategoryFilterChange} isAllChecked={isAllChecked} handleAllOptionChange={handleAllOptionChange}/>
      <button type='button' className={`reset-filters-btn ${resetActive ? 'active' : ''}`} disabled={!resetActive} onClick={handleReset}>Reset Filters <XIcon /></button>
    </div>
  )
}

export default FilterBar;