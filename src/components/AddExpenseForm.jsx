import { useState } from 'react';
import AddCategoryForm from './AddCategoryForm';

// Takes optional expense prop in case the form is being used to edit an existing expense
function AddExpenseForm({ setIsVisible, addExpense, expense, categories, addCategory, setIsAddCategoryFormVisible }) {

  function handleCancel() {
    setIsVisible(false);
  }

  function handleSubmit(formData) {
    const id = (parseFloat(formData.get("id")));
    const amount = parseFloat(formData.get("amount"));
    const date = formData.get("date");
    const description = formData.get("description");
    const categoryId = formData.get("categoryId");

    addExpense(id, amount, date, description, categoryId);
    setIsVisible(false);
  }

  function handleAddCategoryClick(e) {
    e.preventDefault();
    setIsAddCategoryFormVisible(prev => !prev);
  }

  return (
    <div className='add-expense-form-container'>
      <form className="add-expense-form" action={handleSubmit}>
        <input name="id" type="hidden" defaultValue={expense?.id ?? -1}></input>
        <label>
          Amount
          <div className="amount-input-div">
            $<input name="amount"  defaultValue={expense?.amount ?? 0} className="amount-input" type="number" min="0.01" max="999999.99" step="0.01" required />
          </div>
        </label>
        <label>
          Date
          <input name="date" defaultValue={expense?.date ?? new Date().toLocaleDateString('en-CA')} className="date-input" type="date" required />
        </label>
        <label>
          Description
          <input name="description" defaultValue={expense?.description ?? ""} className="description-input" type="text" required />
        </label>
          
        <label className="category-label">
          Category
          <select name="categoryId" defaultValue={expense?.categoryId ?? 0} className="category-select" required>
            { categories.map((category) => (<option key={category.id} value={category.id}>{category.category}</option>)) }
          </select>
          <button type="button" className="show-add-category-component-btn" onClick={handleAddCategoryClick}>Add New Category</button>
        </label>
        <div className="add-expense-submit-btn-div">
            <button className="add-expense-submit-btn" type="submit">{expense ? 'Save' : 'Add'}</button>
            <button className="cancel-expense-submit-btn" type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default AddExpenseForm;