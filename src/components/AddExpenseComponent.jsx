import { useState, useEffect } from 'react';
import AddExpenseForm from './AddExpenseForm';
import AddIcon from '../assets/plus-circle.svg?react';


function AddExpenseComponent({ isAddExpenseFormOpen, setIsAddExpenseFormOpen, addExpense, categories, addCategory, setIsAddCategoryFormVisible, isEditExpenseForm, setIsEditExpenseForm, editableExpense }) {
  function handleBtnClick() {
    setIsAddExpenseFormOpen(true);
  }

  return (
    <div className={`add-expense-component ${isAddExpenseFormOpen ? 'active' : ''}`}>
      <button title='Create a new expense' className="add-expense-btn" onClick={handleBtnClick}><AddIcon />Add Expense</button>
      {isAddExpenseFormOpen && (
        <div className='modal-backdrop' onClick={() => setIsAddExpenseFormOpen(false)}>
          <div className='modal' onClick={(e) => e.stopPropagation()}>
            <AddExpenseForm isOpen={isAddExpenseFormOpen} setIsOpen={setIsAddExpenseFormOpen} addExpense={addExpense} expense={editableExpense} categories={categories} setIsAddCategoryFormVisible={setIsAddCategoryFormVisible} isEditExpenseForm={isEditExpenseForm} setIsEditExpenseForm={setIsEditExpenseForm} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AddExpenseComponent;