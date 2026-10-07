import { useState, useEffect, useRef } from 'react';
import AddExpenseForm from './AddExpenseForm';
import CaretDownIcon from '../assets/caret-down-fill.svg?react';


function AddExpenseComponent({ addExpense, categories, addCategory, setIsAddCategoryFormVisible }) {
    const [isFormVisible, setIsFormVisible] = useState(false);
    function handleBtnClick() {
        setIsFormVisible(!isFormVisible);
    }

    const containerRef = useRef(null);
      
    useEffect(() => {
    function handleClickOutside(event) {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setIsFormVisible(false); // Minimize or close
        }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
    }, []);

    return (
        <div ref={containerRef} className={`add-expense-component ${isFormVisible ? 'active' : ''}`}>
            <button title='Create a new expense' className="add-expense-btn" onClick={handleBtnClick}>New Expense <CaretDownIcon className="caret-down-icon" width="0.7rem" /></button>
            <AddExpenseForm setIsVisible={setIsFormVisible} isVisible={isFormVisible} addExpense={addExpense} categories={categories} setIsAddCategoryFormVisible={setIsAddCategoryFormVisible} isEditExpenseForm={false} />
        </div>
    );
}

export default AddExpenseComponent;