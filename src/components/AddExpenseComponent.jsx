import { useState } from 'react';
import AddIcon from '../assets/add-icon.svg?react';
import AddExpenseForm from './AddExpenseForm';


function AddExpenseComponent({ addExpense }) {
    const [isFormVisible, setIsFormVisible] = useState(false);
    function handleBtnClick() {
        setIsFormVisible(!isFormVisible);
    }

    return (
        <div className="add-expense-component">
            <button className="add-expense-btn" onClick={handleBtnClick}><AddIcon /> New Expense</button>
            {isFormVisible ? (<AddExpenseForm setIsVisible={setIsFormVisible} addExpense={addExpense}/>) : <div className="add-expense-form-minimized"></div>}
        </div>
    );
}

export default AddExpenseComponent;