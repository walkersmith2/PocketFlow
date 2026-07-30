import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';

import ExpenseCard from '../components/ExpenseCard';
import AddExpenseComponent from '../components/AddExpenseComponent';
import PieChart from '../components/PieChart';

import PersonIcon from '../assets/person-icon.svg?react';

function HomePage() {

  const [expenses, setExpenses] = useState([]);
  const { session } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    getExpenses();
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
    <div className="homepage-container">
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
      <main className="homepage-main">
        <div className="expense-cards-container">
          <AddExpenseComponent addExpense={addExpense}/>
          <ul className="expenses-ul">
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
        <div className="chart-view-container">
          <div className="pie-chart-container">
            <PieChart expenses={expenses}/>
          </div>
          <form className="filter-form">
            <h2>Filter by date range</h2>
            <label>
              <input name="filter-date-range" type="radio"></input>
              Current Week
            </label>
            <label>
              <input name="filter-date-range" type="radio"></input>
              Current Month
            </label>
            <label>
              <input name="filter-date-range" type="radio"></input>
              Current Year
            </label>
            <label>
              <input name="filter-date-range" type="radio"></input>
              All Time
            </label>
          </form>
        </div>
      </main>
      <footer>
        <p>Walker Smith 2026</p>
      </footer>
    </div> 
  );
}

export default HomePage;
