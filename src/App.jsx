import { useState } from 'react'
import './App.css'
import ExpenseCard from './components/ExpenseCard'
import AddExpenseComponent from './components/AddExpenseComponent'
import PersonIcon from './assets/person-icon.svg?react';


function App() {
  
  const [expenses, setExpenses] = useState([
    {
      id: 0,
      amount: 17.02,
      description: "McDonald's",
      category: "Food & Drink",
      date: "Jul 9",
    },
    {
      id: 1,
      amount: 42,
      description: "Cheesecake Factory",
      category: "Food & Drink",
      date: "Jul 11",
    },
    {
      id: 2,
      amount: 13,
      description: "Dodger Dog",
      category: "Food & Drink",
      date: "Jul 11",
    },
    {
      id: 3,
      amount: 60,
      description: "Six Flags",
      category: "Entertainment",
      date: "Jul 12",
    }
  ])

  const [nextUID, setNextUID] = useState(4);
  
  function getNextUID() {
    const currentUID = nextUID;
    setNextUID(nextUID + 1);
    return currentUID;
  }

  function deleteExpense(expenseId) {
    setExpenses(expenses.filter((expense) => expense.id != expenseId));
  }

  function addExpense(amount, date, description, category) {
    setExpenses([...expenses, 
      {
        id: getNextUID(),
        amount: parseFloat(amount),
        date: date,
        description: description,
        category: category
      }
    ]);
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
        <AddExpenseComponent addExpense={addExpense}/>
        <ul id="expenses-ul">
          {expenses.map((expense, index) => (
            <li key={index}>
              <ExpenseCard expense={expense} deleteExpense={deleteExpense}/>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

export default App
