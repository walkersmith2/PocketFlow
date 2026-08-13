import { useState } from 'react';
import AddCategoryForm from './AddCategoryForm';

// Takes optional expense prop in case the form is being used to edit an existing expense
function AddExpenseForm({ setIsVisible, addExpense, expense, categories, addCategory }) {
  const [isAddCategoryFormVisible, setIsAddCategoryFormVisible] = useState(false);

  function handleCancel() {
    setIsVisible(false);
  }

  function handleSubmit(formData) {
    const id = (parseFloat(formData.get("id")));
    const amount = parseFloat(formData.get("amount"));
    const date = new Date(formData.get("date"));
    const description = formData.get("description");
    const category = formData.get("category");

    addExpense(id, amount, date, description, category);
    setIsVisible(false);
  }

  function handleAddCategoryClick(e) {
    e.preventDefault();
    setIsAddCategoryFormVisible(prev => !prev);
  }

  return (
    <>
      <form className="add-expense-form" action={handleSubmit}>
        <input name="id" type="hidden" defaultValue={expense?.id ?? -1}></input>
        <label>
          <div className="amount-input-div">
            $<input name="amount"  defaultValue={expense?.amount ?? 0} className="amount-input" type="number" min="0.01" max="999999.99" step="0.01" required />
          </div>
          Amount
        </label>
        <label>
          <input name="date" defaultValue={expense?.date ?? new Date().toLocaleDateString('en-CA')}className="date-input" type="date" required />
          Date
        </label>
        <label>
          <input name="description" defaultValue={expense?.description ?? ""} className="description-input" type="text" required />
          Description
        </label>
          
        <label>
          <select name="category" defaultValue={expense?.category ?? ""} className="category-select" required>
            { categories.map((category) => (<option key={category.id} value={category.category}>{category.category}</option>)) }
          </select>
          <button type="button" className="show-add-category-component-btn" onClick={handleAddCategoryClick}>+</button>
          Category
        </label>
        <div className="add-expense-submit-btn-div">
            <button className="add-expense-submit-btn" type="submit">Add</button>
            <button className="cancel-expense-submit-btn" type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
      {isAddCategoryFormVisible && <AddCategoryForm addCategory={addCategory} />}
    </>
  );
}

export default AddExpenseForm;