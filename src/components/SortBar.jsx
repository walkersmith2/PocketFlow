import { useState } from 'react';

import Dropdown from './Dropdown';

import SortDownIcon from '../assets/sort-down.svg?react';
import SortDownAltIcon from '../assets/sort-down-alt.svg?react';

const sortBody = [
  {
    value: 'date',
    text: 'Date',
  },
  {
    value: 'amount',
    text: 'Amount',
  },
];

function SortBar({ sortCondition, setSortCondition }) {
  const [condition, setCondition] = useState('date');
  const [direction, setDirection] = useState('ascending');
  const [activeDropdown, setActiveDropdown] = useState('');

  function handleConditionChange(e) {
    setCondition(e.target.value);
    setSortCondition(`${e.target.value}-${direction}`);
    console.log("set condition: ", `${e.target.value}-${direction}`);
  }

  function handleDirectionChange(e) {
    if(direction === 'descending') {
      setDirection('ascending');
      setSortCondition(`${condition}-ascending`);
    }
    else {
      setDirection('descending');
      setSortCondition(`${condition}-descending`);
    }
  }

  return (
    <div className="sort-bar">
      <Dropdown name='sort' header={`Sort By: ${condition}`} type='radio' body={sortBody} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} filter={condition} handleFilterChange={handleConditionChange}/>
      <label className="sort-direction-toggle">
        <input type="checkbox" checked={direction === "descending"} onChange={handleDirectionChange}/>
        {direction === 'descending' ? <SortDownIcon className="sort-down-icon"/> : <SortDownAltIcon className="sort-down-alt-icon"/>}
      </label>
    </div>
  );
}

export default SortBar;