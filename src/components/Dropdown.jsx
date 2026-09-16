import { useState } from 'react';

import CaretDownIcon from '../assets/caret-down-fill.svg?react';

function Dropdown({ name, header, type, body, activeDropdown, setActiveDropdown, filter, handleFilterChange, isAllChecked, handleAllOptionChange }) {
    const isExpanded = activeDropdown === name;

    function handleClick(e) {
        e.preventDefault();
        setActiveDropdown(prev => prev === name ? '' : name);
    }

    /*
        header: 'date',
        type: 'radio',
        body: [
            {
                value: 'x',
                text: 'xx',
            },
            {
                value: 'y',
                text: 'yy',
            },
        ],
    */
    return (
        <div className='dropdown'>
            <button type='button' className={`dropdown-header ${isExpanded ? 'expanded' : ''}`} onClick={handleClick}>{header} <CaretDownIcon className="caret-down-icon" width='0.7rem' /></button>
            <div className={`dropdown-body ${isExpanded ? 'expanded' : ''}`}>
                <div className='dropdown-body-inner'>
                    {body.map((elem, idx) => (
                        <label key={idx}>
                            <input type={type} name={header} value={elem.value} checked={type === 'radio' ? filter === elem.value : (elem.value === 'all' ? isAllChecked : filter.has(elem.value))} onChange={type === 'checkbox' && elem.value=== 'all' ? handleAllOptionChange : handleFilterChange}/>
                            {elem.text}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dropdown;