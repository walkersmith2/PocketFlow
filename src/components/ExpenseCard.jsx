import styles from './ExpenseCard.module.css'
import EditIcon from '../assets/edit-icon.svg?react';
import DeleteIcon from '../assets/trash-icon.svg?react';



export default function ExpenseCard({ expense, deleteExpense }) {
    function handleEdit() {
        console.log("edited");
    }
    
    function handleDelete() {
        console.log("deleted");
        deleteExpense(expense.id);
    }

    return (
        <div className={styles.expenseCard}>
            <div className={styles.textDiv}>
                <h2>${expense.amount.toFixed(2)}</h2>
                <div className={styles.subtitleDiv} id="subtitle-div">
                    <p>id: {expense.id}</p>
                    <p>{expense.date}</p>
                    <p>{expense.description}</p>
                    <p id="test">{expense.category}</p>
                </div>
            </div>
            <div className={styles.btnDiv}>
                <button><EditIcon onClick={handleEdit}/></button>
                <button><DeleteIcon onClick={handleDelete}/></button>
            </div>
        </div>
    )
}