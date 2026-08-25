import { useState, useEffect } from 'react';
import AddCategoryForm from './AddCategoryForm';

import EditIcon from '../assets/edit-icon.svg?react';
import DeleteIcon from '../assets/trash-icon.svg?react';
import SaveIcon from '../assets/check-lg-icon.svg?react';

function FilterBar({ expenses, categories, visibleExpenses, setVisibleExpenses, dateFilter, setDateFilter, categoryFilter, setCategoryFilter, amountFilter, setAmountFilter, addCategory, deleteCategory }) {
  const [editableCategory, setEditableCategory] = useState();
  const [editableCategoryText, setEditableCategoryText] = useState("");
  const [nonEmptyCategories, setNonEmptyCategories] = useState();
  const [isAddCategoryFormVisible, setIsAddCategoryFormVisible] = useState(false);

  

  useEffect(() => {
    setCategoryFilter(prev => {
      const newSet = new Set(prev);
      categories.forEach(category => newSet.add(category.id));
      return newSet;
    });
    setNonEmptyCategories(prev => {
      const newSet = new Set(prev);
      expenses.forEach(expense => newSet.add(expense.categoryId));
      return newSet;
    });
    console.log("nonempty: ", nonEmptyCategories)
  }, [categories]);
  
  const isAllChecked = categories.length > 0 && categories.every(category => categoryFilter.has(category.id));
  
  function handleAddCategoryClick(e) {
    e.preventDefault();
    setIsAddCategoryFormVisible(prev => !prev);
  }

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

  function handleEditCategoryClick(e) {
    e.preventDefault();
    const id = Number(e.currentTarget.value);
    if(!editableCategory) {
      setEditableCategory(id);
      setEditableCategoryText(categories.find(category => id === category.id).category);
    }
    console.log("editing", id);
  }

  function handleSaveCategoryClick(e) {
    e.preventDefault();
    const id = Number(e.currentTarget.value);
    addCategory(id, editableCategoryText, categories.find(category => id === category.id).color);
    setEditableCategory(null);
    console.log("saved", id);
  }

  function handleDeleteCategoryClick(e) {
    e.preventDefault();
    const id = e.currentTarget.value;
    deleteCategory(id);
    console.log("delete");
  }

  function handleEditableCategoryTextChange(e) {
    setEditableCategoryText(e.target.value);
  }

  function handleAmountFilterChange(e) {
    setAmountFilter(parseFloat(e.target.value));
  }

  return (
    <>
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
        {categories.sort((a,b) => a.id - b.id).map((category) => (
          <div key={category.id} className="category-div">
            <div className="color-label" style={{backgroundColor: category.color}}></div>
            <label key={category.id}>
              <input name="filter-category" type="checkbox" value={category.id} checked={categoryFilter.has(category.id)} onChange={handleCategoryFilterChange}></input>
              { editableCategory === category.id ? <input type="text" value={editableCategoryText} onChange={handleEditableCategoryTextChange}/> : category.category }
            </label>
            <div className="btnDiv">
              {editableCategory === category.id ? <button onClick={handleSaveCategoryClick} value={category.id}><SaveIcon /></button> :
              <button value={category.id} onClick={handleEditCategoryClick} ><EditIcon /></button>}
              <button className="deleteBtn" value={category.id} onClick={handleDeleteCategoryClick} disabled={nonEmptyCategories.has(category.id)}><DeleteIcon /></button>
            </div>
          </div>
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
    <button type="button" className="show-add-category-component-btn" onClick={handleAddCategoryClick}>+</button>
    {isAddCategoryFormVisible && <AddCategoryForm addCategory={addCategory} setIsAddCategoryFormVisible={setIsAddCategoryFormVisible} />}
    </>
  )
}

export default FilterBar;