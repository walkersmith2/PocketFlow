import styles from './ExpenseCard.module.css'
import EditIcon from '../assets/edit-icon.svg?react';
import DeleteIcon from '../assets/trash-icon.svg?react';



export default function ExpenseCard({amount, date, description, category}) {

    return (
        <div className={styles.expenseCard}>
            <div className={styles.textDiv}>
                <h2>${amount.toFixed(2)}</h2>
                <div className={styles.subtitleDiv} id="subtitle-div">
                    <p>{date}</p>
                    <p>{description}</p>
                    <p id="test">{category}</p>
                </div>
            </div>
            <div className={styles.btnDiv}>
                <button><EditIcon /></button>
                <button><DeleteIcon /></button>
            </div>
        </div>
    )
}