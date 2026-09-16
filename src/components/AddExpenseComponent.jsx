import { useState } from 'react';
import AddExpenseForm from './AddExpenseForm';
import CaretDownIcon from '../assets/caret-down-fill.svg?react';


function AddExpenseComponent({ addExpense, categories, addCategory, setIsAddCategoryFormVisible }) {
    const [isFormVisible, setIsFormVisible] = useState(false);
    function handleBtnClick() {
        setIsFormVisible(!isFormVisible);
    }

    return (
        <div className={`add-expense-component ${isFormVisible ? 'active' : ''}`}>
            <button className="add-expense-btn" onClick={handleBtnClick}>New Expense <CaretDownIcon className="caret-down-icon" width='1rem' /></button>
            <AddExpenseForm setIsVisible={setIsFormVisible} isVisible={isFormVisible} addExpense={addExpense} categories={categories} setIsAddCategoryFormVisible={setIsAddCategoryFormVisible} isEditExpenseForm={false} />
        </div>
    );
}

export default AddExpenseComponent;