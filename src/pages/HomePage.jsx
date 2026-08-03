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
  const [dateFilter, setDateFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(["Food & Drink", "Entertainment", "Rent/Utilities"]);
  const [visibleExpenses, setVisibleExpenses] = useState([]);
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getExpenses();
  }, []);

  useEffect(updateVisibleExpenses,[expenses, dateFilter]);

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

  function updateVisibleExpenses() {
    const today = new Date();

    setVisibleExpenses(expenses.filter((expense) => {
      const expenseDate = new Date(expense.date + "T00:00:00");

      if(dateFilter == "week") {
        const start = new Date(today);
        start.setHours(0, 0, 0, 0);
        start.setDate(today.getDate() - today.getDay());
        return expenseDate >= start;
      }
      else if(dateFilter == "month") {
        return expenseDate.getMonth() === today.getMonth() &&
        expenseDate.getFullYear() === today.getFullYear();
      }
      else if(dateFilter == "year") {
        return expenseDate.getFullYear() === today.getFullYear();
      }
      return true;
    }));
  }

  function handleDateFilterChange(e) {
    setDateFilter(e.target.value);
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
              visibleExpenses.length > 0 ?
              visibleExpenses.map((expense, index) => (
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
            <PieChart expenses={visibleExpenses}/>
          </div>
          <form className="filter-form">
            <fieldset>
              <h2>Filter by date range</h2>
              <label>
                <input name="filter-date-range" type="radio" value="week" checked={dateFilter === "week"} onChange={handleDateFilterChange}></input>
                Current Week
              </label>
              <label>
                <input name="filter-date-range" type="radio" value="month" checked={dateFilter === "month"} onChange={handleDateFilterChange}></input>
                Current Month
              </label>
              <label>
                <input name="filter-date-range" type="radio" value="year" checked={dateFilter === "year"} onChange={handleDateFilterChange}></input>
                Current Year
              </label>
              <label>
                <input name="filter-category" type="checkbox"  value="Food & Drink" checked={dateFilter === "all"} onChange={handleDateFilterChange}></input>
                All Time
              </label>
            </fieldset>
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
