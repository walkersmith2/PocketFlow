import { useState } from 'react'
import './App.css'
import ExpenseCard from './components/ExpenseCard'
import AddEntryForm from './components/AddEntryForm'
import AddIcon from './assets/add-icon.svg?react';
import PersonIcon from './assets/person-icon.svg?react';

function App() {
  const [expenses, setExpenses] = useState([
    {
      amount: 17.02,
      description: "McDonald's",
      category: "Food & Drink",
      date: "Jul 9",
    },
    {
      amount: 42,
      description: "Cheesecake Factory",
      category: "Food & Drink",
      date: "Jul 11",
    },
    {
      amount: 13,
      description: "Dodger Dog",
      category: "Food & Drink",
      date: "Jul 11",
    },
    {
      amount: 60,
      description: "Six Flags",
      category: "Entertainment",
      date: "Jul 12",
    }
  ])

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
        <ul id="expenses-ul">
          <button id="add-entry-btn"><AddIcon /> Add Entry</button>
          <AddEntryForm />
          {expenses.map((expense, index) => (
            <li key={index}>
              <ExpenseCard amount={expense.amount} date={expense.date} description={expense.description} category={expense.category} />
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

export default App
