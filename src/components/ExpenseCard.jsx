import { useState } from 'react';
import styles from './ExpenseCard.module.css'
import EditIcon from '../assets/edit-icon.svg?react';
import DeleteIcon from '../assets/trash-icon.svg?react';
import AddExpenseForm from './AddExpenseForm';

export default function ExpenseCard({ expense, addExpense, deleteExpense }) {
    const [isEditable, setIsEditable] = useState(false);
    
    function handleEdit() {
        console.log("editing");
        setIsEditable(true);
    }
    
    function handleDelete() {
        console.log("deleted");
        deleteExpense(expense.id);
    }

    return (
        <>
        {isEditable ? 
        <AddExpenseForm setIsVisible={setIsEditable} addExpense={addExpense} expense={expense}/> :
        <div className={styles.expenseCard}>
            <div className={styles.textDiv}>
                <h2 >${expense.amount.toFixed(2)}</h2>
                <div className={styles.subtitleDiv}>
                    <p>id: {expense.id}</p>
                    {/* <p >{expense.date.toLocaleDateString('en-us', { month: 'short', day: 'numeric' })}</p> */}
                    <p >{new Date(expense.date).toLocaleDateString('en-us', { month: 'short', day: 'numeric' })}</p>
                    <p >{expense.description}</p>
                    <p >{expense.category}</p>
                </div>
            </div>
            <div className={styles.btnDiv}>
                <button onClick={handleEdit}><EditIcon /></button>
                <button onClick={handleDelete}><DeleteIcon /></button>
            </div>
        </div>}
        </>
    )
}