import { useState } from 'react';
import AddExpenseForm from './AddExpenseForm';


function AddExpenseComponent({ addExpense, categories, addCategory, setIsAddCategoryFormVisible }) {
    const [isFormVisible, setIsFormVisible] = useState(false);
    function handleBtnClick() {
        setIsFormVisible(!isFormVisible);
    }

    return (
        <div className="add-expense-component">
            <button className="add-expense-btn" onClick={handleBtnClick}>New Expense</button>
            <AddExpenseForm setIsVisible={setIsFormVisible} isVisible={isFormVisible} addExpense={addExpense} categories={categories} addCategory={addCategory} setIsAddCategoryFormVisible={setIsAddCategoryFormVisible} />
        </div>
    );
}

export default AddExpenseComponent;