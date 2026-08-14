import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';

import ExpenseCard from '../components/ExpenseCard';
import AddExpenseComponent from '../components/AddExpenseComponent';
import PieChart from '../components/PieChart';
import LineChart from '../components/LineChart';
import FilterBar from '../components/FilterBar';
import SortBar from '../components/SortBar';
import PersonIcon from '../assets/person-icon.svg?react';


function HomePage() {

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleExpenses, setVisibleExpenses] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(new Set(categories.map((category) => category.category)));
  const [amountFilter, setAmountFilter] = useState(1000000);
  const [sortCondition, setSortCondition] = useState('date-ascending'); // options: date, amount
  const [isPieChartVisible, setIsPieChartVisible] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getExpenses();
    getCategories();
  }, []);

  useEffect(updateVisibleExpenses,[expenses, dateFilter, categoryFilter, amountFilter, sortCondition]);

  async function getExpenses() {
    const { data, error } = await supabase.from('expenses').select();
    if (error) {
      console.error(error);
      return;
    }
    setExpenses(data);
  }

  async function getCategories() {
    const { data, error } = await supabase.from('categories').select();
    if (error) {
      console.error(error);
      return;
    }
    
    setCategories(data);
  }

  async function deleteExpense(expenseId) {
    const response = await supabase.from('expenses').delete().eq('id',expenseId);
    
    getExpenses();
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
  }


  async function addCategory(category, color) {
    if(categories.includes((row) => row.category === category)) {
      return;
    }
    const row = {category: category, color: color};
    const { data, error } = await supabase.from('categories').upsert(row);

    if (error) {
      console.error(error);
      return;
    }
    getCategories();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  function sortExpenses(expenses) {
    // Sort expenses based on selected sort option
    
    if(sortCondition == "date-ascending") {
      return expenses.sort((a,b) => {
        const aDate = new Date(a.date + "T00:00:00").getTime();
        const bDate = new Date(b.date + "T00:00:00").getTime();
        return aDate - bDate;
      });
    }
    else if(sortCondition == "date-descending") {
      return expenses.sort((a,b) => {
        const aDate = new Date(a.date + "T00:00:00").getTime();
        const bDate = new Date(b.date + "T00:00:00").getTime();
        return bDate - aDate;
      });
    }
    else if(sortCondition == "amount-ascending") {
      return expenses.sort((a,b) => a.amount - b.amount);
    }
    else if(sortCondition == "amount-descending") {
      return expenses.sort((a,b) => b.amount - a.amount);
    }
  }


  function updateVisibleExpenses() {
    let filteredExpenses = [...expenses];

    // Apply date filter
    const today = new Date();
    filteredExpenses = filteredExpenses.filter((expense) => {
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
    });

    // Apply category filter
    filteredExpenses = filteredExpenses.filter((expense) => categoryFilter.has(expense.category));

    // Apply amount filter
    filteredExpenses = filteredExpenses.filter((expense) => parseFloat(expense.amount) < amountFilter);

    // Sort Expenses
    const sortedExpenses = sortExpenses(filteredExpenses);

    setVisibleExpenses(sortedExpenses);
  }

  function handleChartToggleChange(e) {
    if(isPieChartVisible) {
      setIsPieChartVisible(false);
    }
    else {
      setIsPieChartVisible(true);
    }
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
          <AddExpenseComponent addExpense={addExpense} categories={categories} addCategory={addCategory}/>
          <SortBar sortCondition={sortCondition} setSortCondition={setSortCondition} />
          <ul className="expenses-ul">
            {
              visibleExpenses.length > 0 ?
              visibleExpenses.map((expense, index) => (
                  <li key={expense.id}>
                  <ExpenseCard expense={expense} addExpense={addExpense} deleteExpense={deleteExpense} categories={categories} addCategory={addCategory}/>
                  </li>
              )) :
              <li>No expenses to show. Click the <strong>New Expense</strong> button to add an expense or change the filters under the chart.</li>
            }
          </ul>
        </div>
        <div className="chart-view-container">
          <div className="amount-total-container">
            <p>Total: ${visibleExpenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}</p>
          </div>
          <label>
            <input type="checkbox" checked={isPieChartVisible} onChange={handleChartToggleChange}></input>
            Pie Chart View
          </label>
          <div className="chart-container">
            {isPieChartVisible ? <PieChart expenses={visibleExpenses} categories={categories}/> : <LineChart expenses={visibleExpenses} categories={categories} dateFilter={dateFilter}/>}
          </div>
          <FilterBar expenses={expenses} categories={categories} visibleExpenses={visibleExpenses} setVisibleExpenses={setVisibleExpenses} dateFilter={dateFilter} setDateFilter={setDateFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} amountFilter={amountFilter} setAmountFilter={setAmountFilter}/>
        </div>
      </main>
      <footer>
        <p>Walker Smith 2026</p>
      </footer>
    </div> 
  );
}

export default HomePage;
