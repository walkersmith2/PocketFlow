import { useState } from 'react';

function AddCategoryForm({ addCategory }) {
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("#FFFFFF");

  function handleSubmit() {
    addCategory(category, color);
    setCategory("");
    setColor("#FFFFFF");
  }

  return (
    <form className="add-category-form" action={handleSubmit}>
      <h2>Add New Category</h2>
      <label>
        <input type="text" name="category" required value={category} onChange={(e) => setCategory(e.target.value)}></input>
        Category Name
      </label>
      <label>
        <input type="color" name="color" value={color} onChange={(e) => setColor(e.target.value)}></input>
        Label Color
      </label>
      <button type="submit">Add</button>
    </form>
  );
}

export default AddCategoryForm;