import { useState } from 'react';

function AddCategoryForm({ addCategory, isAddCategoryFormVisible, setIsAddCategoryFormVisible, CATEGORY_COLORS }) {
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("red");

  function handleSubmit() {
    addCategory(-1, category, color);
    setCategory("");
    setColor("red");
    setIsAddCategoryFormVisible(false);
  }

  function handleCancel(e) {
    e.preventDefault();
    setIsAddCategoryFormVisible(false);
  }

  return (
    <form className={`add-category-form ${isAddCategoryFormVisible ? 'active' : ''}`} action={handleSubmit}>
      <h2>New Category</h2>
      <label className="category-name-label">
        Name
        <input type="text" name="category" required value={category} maxLength='50' onChange={(e) => setCategory(e.target.value)}></input>
      </label>
      <p>Color</p>
      <div className="category-colors-list">
        {CATEGORY_COLORS.map((elem, index) => (
          <label className="category-form-color-input" key={index}>
            <input type="radio" name="color" value={elem} checked={color === elem} style={{backgroundColor:elem}} onChange={(e) => setColor(elem)}></input>
          </label>
        ))}
      </div>
      <div className="button-div">
        <button type="submit">Add</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default AddCategoryForm;