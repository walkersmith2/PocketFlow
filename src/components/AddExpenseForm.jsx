
// Takes optional expense prop in case the form is being used to edit an existing expense
export default function AddExpenseForm({ setIsVisible, addExpense, expense}) {
    function handleCancel() {
        setIsVisible(false);
    }

    function handleSubmit(formData) {

        const id = (parseFloat(formData.get("id")));
        const amount = parseFloat(formData.get("amount"));
        const date = new Date(formData.get("date"));
        const description = formData.get("description");
        const category = formData.get("category");

        // console.log(amount);
        // console.log(date);
        // console.log(description);
        // console.log(category);

        addExpense(id, amount, date, description, category);
        setIsVisible(false);
    }

    return (
        <form className="add-expense-form" action={handleSubmit}>
            <input name="id" type="hidden" defaultValue={expense?.id ?? -1}></input>
            <label>
                Amount: $
                <input name="amount"  defaultValue={expense?.amount ?? 0} className="amount-input" type="number" min="0.01" max="999999.99" step="0.01" required />
            </label>
            <label>
                Date:
                <input name="date" defaultValue={expense?.date?.toLocaleDateString('en-CA') ?? new Date().toLocaleDateString('en-CA')}className="date-input" type="date" required />
            </label>
            <label>
                Description:
                <input name="description" defaultValue={expense?.description ?? ""} className="description-input" type="text" required />
            </label>
            
            <label>Category: 
                <select name="category" defaultValue={expense?.category ?? ""} className="category-select" required>
                    <option value=""></option>
                    <option value="Food & Drink">Food & Drink</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Rent/Utilities">Rent/Utilities</option>
                </select>
            </label>
            
            <div className="add-expense-submit-btn-div">
                <button className="add-expense-submit-btn" type="submit">Add</button>
                <button className="cancel-expense-submit-btn" type="button" onClick={handleCancel}>Cancel</button>
            </div>
        </form>
    )
}
