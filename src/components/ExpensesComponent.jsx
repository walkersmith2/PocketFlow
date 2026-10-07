import InfoIcon from '../assets/info-lg.svg?react';

const rootStyles = window.getComputedStyle(document.body);
const underBudgetColor = rootStyles.getPropertyValue('--under-budget').trim();
const overBudgetColor = rootStyles.getPropertyValue('--over-budget').trim();

function ExpensesComponent({ visibleExpenses, categories}) {

  return (
    <div className='expenses-component'>
      <div className='expenses-table'>
        <div className='scrollable-table'>
          <table>
            <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                </tr>
            </thead>
            <tbody>
              {visibleExpenses.map((expense) => {

                return (
                  <tr key={expense.id} >
                    <td>{expense.description}</td>
                    <td>${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>{new Date(expense.date + 'T00:00:00').toLocaleDateString('en-us', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td><span className='category-span'><div className='category-color-label' style={{ backgroundColor: categories.find(category => category.id === expense.categoryId).color }}></div>{categories.find(category => category.id === expense.categoryId).category}</span></td>
                  </tr> 
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ExpensesComponent;