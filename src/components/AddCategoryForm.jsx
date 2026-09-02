import { useState } from 'react';

function AddCategoryForm({ addCategory, setIsAddCategoryFormVisible }) {
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("#FFFFFF");

  function handleSubmit() {
    addCategory(-1, category, color);
    setCategory("");
    setColor("#FFFFFF");
    setIsAddCategoryFormVisible(false);
  }

  function handleCancel(e) {
    e.preventDefault();
    setIsAddCategoryFormVisible(false);
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
      <div className="button-div">
        <button type="submit">Add</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default AddCategoryForm;