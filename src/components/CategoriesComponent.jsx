import { useState, useEffect } from 'react';

import EditIcon from '../assets/edit-icon.svg?react';
import DeleteIcon from '../assets/trash-icon.svg?react';
import SaveIcon from '../assets/check-lg-icon.svg?react';
import CaretLeftIcon from '../assets/caret-left-fill.svg?react';

function CategoriesComponent({ expenses, categories, categoryFilter, setCategoryFilter, addCategory, deleteCategory, setIsAddCategoryFormVisible }) {
  const [editableCategory, setEditableCategory] = useState();
  const [editableCategoryText, setEditableCategoryText] = useState("");
  const [nonEmptyCategories, setNonEmptyCategories] = useState();
  const [isActive, setIsActive] = useState(true);

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

  function handleMinimize(e) {
    e.preventDefault();
    setIsActive(prev => !prev);
  }

  return (
    <div className={`categories-component-container ${isActive ? 'active' : ''}`}>
      <button className="expand-categories-component-btn" type="button" onClick={handleMinimize}><span>View Categories</span><CaretLeftIcon /></button>
      <div className="categories-component">
        <h2>Categories</h2>
        <div className="categories-list">
          {categories.sort((a,b) => a.id - b.id).map((category) => (
            <div key={category.id} className="category-div">
                <div className="color-label" style={{backgroundColor: category.color}}></div>
                <div className="category-text-div">{ editableCategory === category.id ? <input type="text" value={editableCategoryText} onChange={handleEditableCategoryTextChange}/> : category.category }</div>
              <div className="btnDiv">
                {editableCategory === category.id ? <button onClick={handleSaveCategoryClick} value={category.id}><SaveIcon /></button> :
                <button value={category.id} onClick={handleEditCategoryClick} ><EditIcon /></button>}
                <button className="deleteBtn" value={category.id} onClick={handleDeleteCategoryClick} disabled={nonEmptyCategories.has(category.id)}><DeleteIcon /></button>
              </div>
            </div>
          ))}
        </div>
        <p>{categories.length} categories</p>
        <div className="add-category-btn-container">
          <button type="button" className="show-add-category-component-btn" onClick={handleAddCategoryClick}>Add New Category</button>
        </div>
      </div>
    </div>
  )
}

export default CategoriesComponent;