import { useState } from 'react';
import AddIcon from '../assets/add-icon.svg?react';

export default function AddExpenseComponent({ addExpense }) {
    const [isVisible, setIsVisible] = useState(false);

    function handleClick() {
        setIsVisible(!isVisible);
    }

    const handleSubmit = (formData) => {
        const amount = parseFloat(formData.get("amount"));
        const date = formData.get("date");
        const description = formData.get("description");
        const category = formData.get("category");

        addExpense(amount, date, description, category);
        setIsVisible(false);
    }

    return (
        <div className="add-expense-component">
            <button className="add-expense-btn" onClick={handleClick}><AddIcon /> New Expense</button>
            {isVisible && (
                <form className="add-expense-form" action={handleSubmit}>
                    <label>
                        Amount:
                        <input name="amount" type="text" />
                    </label>
                    <label>
                        Date:
                        <input name="date" id="date-input" type="text" />
                    </label>
                    <label>
                        Description:
                        <input name="description" id="description-input" type="text" />
                    </label>
                    
                    <label>Category: 
                        <select name="category" id="category-select">
                            <option value="">Select...</option>
                            <option value="Food & Drink">Food & Drink</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Rent/Utilities">Rent/Utilities</option>
                        </select>
                    </label>
                    <button type="submit">Add Expense</button>
                </form>
            )}
        </div>
    );
}