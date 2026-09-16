import { useState } from 'react';

function EditCategoryColor({ CATEGORY_COLORS, editableCategoryColor, setEditableCategoryColor }) {
    const [isActive, setIsActive] = useState(false);

    return (
        <>
            <button type="button" className="edit-category-color-btn" onClick={() => {setIsActive(prev => !prev)}}><div className="color-label" style={{backgroundColor: editableCategoryColor}}></div></button>
            {isActive && 
            <div>
                <div className="category-colors-list edit-category-color">
                    {CATEGORY_COLORS.map((elem, index) => (
                    <label className="category-form-color-input" key={index}>
                        <input type="radio" name="color" value={elem} checked={editableCategoryColor === elem} style={{backgroundColor:elem}} onChange={(e) => {
                            setEditableCategoryColor(elem);
                            setIsActive(false);
                            }}></input>
                    </label>
                    ))}
                </div>
            </div>
            }
        </>
    );
}

export default EditCategoryColor;
