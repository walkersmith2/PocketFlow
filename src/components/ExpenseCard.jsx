import { useState } from 'react';
import styles from './ExpenseCard.module.css'
import EditIcon from '../assets/edit-icon.svg?react';
import DeleteIcon from '../assets/trash-icon.svg?react';
import AddExpenseForm from './AddExpenseForm';

function ExpenseCard({ expense, addExpense, deleteExpense, categories, addCategory }) {
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
        <AddExpenseForm setIsVisible={setIsEditable} addExpense={addExpense} expense={expense} categories={categories}  addCategory={addCategory}/> :
        <div className={styles.expenseCardContainer}>
            <div className={styles.colorLabel} style={{backgroundColor: categories.find(category => category.id === expense.categoryId).color}}></div>
            <div className={styles.expenseCard}>
                <div className={styles.textDiv}>
                    <h2 >${expense.amount.toFixed(2)}</h2>
                    <div className={styles.subtitleDiv}>
                        <p >{new Date(expense.date + 'T00:00:00').toLocaleDateString('en-us', { month: 'short', day: 'numeric' })}</p>
                        <p >{expense.description}</p>
                        <p >{categories.find(category => category.id === expense.categoryId).category}</p>
                    </div>
                </div>
                <div className={styles.btnDiv}>
                    <button onClick={handleEdit}><EditIcon /></button>
                    <button className={styles.deleteBtn} onClick={handleDelete}><DeleteIcon /></button>
                </div>
            </div>
        </div>}
        
        </>
    )
}

export default ExpenseCard;