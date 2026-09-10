import { useState } from 'react';


const CATEGORY_COLORS = [
  '#FFBE0B',
  '#FB5607',
  '#FF006E',
  '#d90b15',
  '#8338EC',
  '#3A86FF',
  '#39d798',
  '#1CC202',
  '#82C202',
]


function AddCategoryForm({ addCategory, setIsAddCategoryFormVisible }) {
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
    <form className="add-category-form" action={handleSubmit}>
      <h2>Add New Category</h2>
      <label>
        <input type="text" name="category" required value={category} maxLength='50' onChange={(e) => setCategory(e.target.value)}></input>
        Category Name
      </label>
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