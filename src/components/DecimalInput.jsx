import { useState } from 'react';

function DecimalInput({ value, onValueChange, decimals = 2 }) {
  const [draft, setDraft] = useState(null);

  return (
    <input
      type='number'
      step='any'
      value={draft ?? value.toFixed(decimals)}
      onFocus={(e) => e.target.select()}
      onChange={(e) => {
        setDraft(e.target.value);
        const n = parseFloat(e.target.value);
        if (!Number.isNaN(n) && n >= 0) onValueChange(n);
      }}
      onBlur={() => setDraft(null)}
    />
  );
}

export default DecimalInput;