import { useState } from 'react';
import './App.css';
import ExpenseCard from './components/ExpenseCard';
import AddExpenseComponent from './components/AddExpenseComponent';
import PieChart from './components/PieChart';
import PersonIcon from './assets/person-icon.svg?react';

function App() {
  
  const [expenses, setExpenses] = useState([
    {
      id: 0,
      amount: 17.02,
      description: "McDonald's",
      category: "Food & Drink",
      date: new Date("2026-07-10"),
    },
    {
      id: 1,
      amount: 42,
      description: "Cheesecake Factory",
      category: "Food & Drink",
      date: new Date("2026-07-11"),
    },
    {
      id: 2,
      amount: 13,
      description: "Dodger Dog",
      category: "Food & Drink",
      date: new Date("2026-07-11"),
    },
    {
      id: 3,
      amount: 60,
      description: "Six Flags",
      category: "Entertainment",
      date: new Date("2026-07-13"),
    }
  ])

  const [nextUID, setNextUID] = useState(10);

  function getNextUID() {
    const currentUID = nextUID;
    setNextUID(nextUID + 1);
    return currentUID;
  }

  function deleteExpense(expenseId) {
    setExpenses(expenses.filter((expense) => expense.id != expenseId));
  }

  function addExpense(id, amount, date, description, category) {
    if(expenses.some(expense => expense.id == id)) {
      // Replace existing expense based on id
      const index = expenses.findIndex((expense, index) => expense.id == id);
      setExpenses([...expenses.slice(0,index), 
        {
          id: id,
          amount: amount,
          date: date,
          description: description,
          category: category
        },
        ...expenses.slice(index + 1)]
      );
    }
    else {
      // Add new expense to expenses array
      setExpenses([...expenses, 
        {
          id: getNextUID(),
          amount: amount,
          date: date,
          description: description,
          category: category
        }
      ]);
    }
  }


  return (
    <>
      <header>
        <h1>Expense Tracker</h1>
        <ul id="header-buttons-ul">
          <li>
            <button><PersonIcon /> Account</button>
          </li>
          <li>
            <button>Log Out</button>
          </li>
        </ul>
      </header>
      <main>
        <PieChart />
        <AddExpenseComponent addExpense={addExpense}/>
        <ul id="expenses-ul">
          {
            expenses.length > 0 ?
            expenses.map((expense, index) => (
              <li key={expense.id}>
                <ExpenseCard expense={expense} addExpense={addExpense} deleteExpense={deleteExpense}/>
              </li>
            )) :
            <li>No expenses yet! Click the <strong>New Expense</strong> button to add an expense.</li>
          }
        </ul>
      </main>
    </>
  )
}

export default App
