import { useState } from 'react';

function SortBar({ sortCondition, setSortCondition }) {
    const [condition, setCondition] = useState('date');
    const [direction, setDirection] = useState('ascending');

    function handleConditionChange(e) {
        setCondition(e.target.value);
        setSortCondition(`${e.target.value}-${direction}`);
        console.log("set condition: ", `${e.target.value}-${direction}`);
    }

    function handleDirectionChange(e) {
        setDirection(e.target.value);
        setSortCondition(`${condition}-${e.target.value}`);
        console.log("set condition: ", `${condition}-${e.target.value}`);
    }

    return (
        <form className="sort-form">
            <h2>Sort</h2>
            <select value={condition} onChange={handleConditionChange}>
                <option value="date">Date</option>
                <option value="amount">Amount</option>
            </select>
            <label>
                <input type="radio" name="direction" value="ascending" checked={direction === "ascending"} onChange={handleDirectionChange}/>
                Ascending
            </label>
            <label>
                <input type="radio" name="direction" value="descending" checked={direction === "descending"} onChange={handleDirectionChange}/>
                Descending
            </label>
        </form>
    );
}

export default SortBar;