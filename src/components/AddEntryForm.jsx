export default function AddEntryForm() {
    return (
        <form className="add-entry-form">
            <label for="amount-input">Amount: </label>
            <input id="amount-input" type="text" />
            
            <label for="date-input">Date: </label>
            <input id="date-input" type="text" />
            
            <label for="description-input">Description: </label>
            <input id="description-input" type="text" />
            
            <label for="category-select">Category: </label>
            <select id="category-select">
                <option value="">Select...</option>
                <option value="Food & Drink">Food & Drink</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Rent/Utilities">Rent/Utilities</option>
            </select>
            <button type="submit">Submit</button>
        </form>
    )
}