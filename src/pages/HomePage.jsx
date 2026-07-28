import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

import ExpenseCard from '../components/ExpenseCard';
import AddExpenseComponent from '../components/AddExpenseComponent';
import PieChart from '../components/PieChart';

import PersonIcon from '../assets/person-icon.svg?react';

function HomePage() {

  const [session, setSession] = useState(null);
  const hardCodedData = [
    {
      id: 0,
      amount: 17.02,
      description: "McDonald's",
      category: "Food & Drink",
      date: new Date("2026-07-10"),
    },
    {
      id: 1,
      amount: 35.02,
      description: "Five Guy's",
      category: "Food & Drink",
      date: new Date("2026-07-11"),
    },
    {
      id: 2,
      amount: 57.63,
      description: "Cheesecake Factory",
      category: "Food & Drink",
      date: new Date("2026-07-12"),
    },
    {
      id: 3,
      amount: 13,
      description: "Dodger Dog",
      category: "Food & Drink",
      date: new Date("2026-07-11"),
    },
    {
      id: 4,
      amount: 60,
      description: "Six Flags",
      category: "Entertainment",
      date: new Date("2026-07-13"),
    },
    {
      id: 5,
      amount: 1400.00,
      description: "Rent",
      category: "Rent/Utilities",
      date: new Date("2026-07-01"),
    },
    {
      id: 6,
      amount: 130,
      description: "Electric Bill",
      category: "Rent/Utilities",
      date: new Date("2026-07-05"),
    }
  ];

  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    getExpenses()
  }, []);

  async function getExpenses() {
    const { data, error } = await supabase.from('expenses').select();
    if (error) {
      console.error(error);
      return;
    }
    console.log(data);
    setExpenses(data);
  }

  async function deleteExpense(expenseId) {
    const response = await supabase.from('expenses').delete().eq('id',expenseId);
    
    getExpenses();
    console.log("delete");
  }

  async function addExpense(id, amount, date, description, category) {
    const row = id == -1 ? {amount: amount, date: date, description: description, category: category} :
    {id: id, amount: amount, date: date, description: description, category: category};
    const { data, error } = await supabase.from('expenses').upsert(row);

    if (error) {
      console.error(error);
      return;
    }
    getExpenses();
    console.log("upsert")
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login');
  }

    return (
      <>
        <header>
            <h1>Expense Tracker</h1>
            <ul id="header-buttons-ul">
                <li>
                    <button className="account-btn header-btn">
                    <span><PersonIcon /></span>
                    <span>Account</span>
                    </button>
                </li>
                <li>
                    <button className="logout-btn header-btn" onClick={handleLogout}>Log Out</button>
                </li>
            </ul>
        </header>
        <main>
            <PieChart expenses={expenses}/>
            <div>
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
            </div>
        </main>
        <footer>
            <p>Walker Smith 2026</p>
        </footer>
      </> 
    );
}

export default HomePage;
