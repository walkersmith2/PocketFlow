import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';

import ExpenseCard from '../components/ExpenseCard';
import AddExpenseComponent from '../components/AddExpenseComponent';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import SortBar from '../components/SortBar';
import AddCategoryForm from '../components/AddCategoryForm';
import FilterBar from '../components/FilterBar';
import CategoriesComponent from '../components/CategoriesComponent';

import PieChartIcon from '../assets/pie-chart-fill.svg?react';
import BarChartIcon from '../assets/bar-chart-fill.svg?react';
import CaretLeftIcon from '../assets/caret-left-fill.svg?react';
import CaretRightIcon from '../assets/caret-right-fill.svg?react';

const CATEGORY_COLORS = [
  '#FFBE0B',
  '#FB5607',
  '#FF006E',
  '#d90b15',
  '#ab7eeb',
  '#6e07f5',
  '#3A86FF',
  '#4557f8',
  '#b6ff18',
  '#008a05',
];

const monthlyBudget = 10000;


function HomePage() {

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleExpenses, setVisibleExpenses] = useState([]);
  const [timePeriodFilter, setTimePeriodFilter] = useState('month');
  const [dateFilter, setDateFilter] = useState(new Date());
  const [categoryFilter, setCategoryFilter] = useState(new Set());
  const [amountFilter, setAmountFilter] = useState(1000000);
  const [sortCondition, setSortCondition] = useState('date-ascending'); // options: date, amount
  const [isPieChartVisible, setIsPieChartVisible] = useState(false);
  const [isAddCategoryFormVisible, setIsAddCategoryFormVisible] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  const rootStyles = window.getComputedStyle(document.body);
  const chartToggleInactiveColor = rootStyles.getPropertyValue('--text').trim();
  const chartToggleActiveColor = rootStyles.getPropertyValue('--text-h').trim();
  
  useEffect(() => {
    getExpenses();
    getCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      setCategoryFilter(new Set(categories.map((category) => category.id)));
    }
  }, [categories]);

  useEffect(updateVisibleExpenses,[expenses, dateFilter, timePeriodFilter, categoryFilter, amountFilter, sortCondition]);

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

  async function addExpense(id, amount, date, description, categoryId) {
    const row = id == -1 ? {amount: amount, date: date, description: description, categoryId: categoryId} :
    {id: id, amount: amount, date: date, description: description, categoryId: categoryId};
    const { data, error } = await supabase.from('expenses').upsert(row);

    if (error) {
      console.error(error);
      return;
    }
    getExpenses();
  }

  async function deleteExpense(expenseId) {
    const response = await supabase.from('expenses').delete().eq('id',expenseId);
    
    getExpenses();
  }


  async function addCategory(id, category, color) {
    if(categories.includes((row) => row.category === category)) {
      return;
    }
    const row = id == -1 ? {category: category, color: color} : {id: id, category: category, color: color};
    const { data, error } = await supabase.from('categories').upsert(row);

    if (error) {
      console.error(error);
      return;
    }
    getCategories();
  }

  async function deleteCategory(categoryId) {
    const response = await supabase.from('categories').delete().eq('id',categoryId);
      
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

    // Apply dateFilter
    filteredExpenses = filteredExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date + "T00:00:00");
      if(timePeriodFilter == "month") {
        return expenseDate.getMonth() === dateFilter.getMonth() &&
        expenseDate.getFullYear() === dateFilter.getFullYear();
      }
      else if(timePeriodFilter == "year") {
        return expenseDate.getFullYear() === dateFilter.getFullYear();
      }
      return true;
    });

    // Apply category filter
    filteredExpenses = filteredExpenses.filter((expense) => categoryFilter.has(expense.categoryId));

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
      <CategoriesComponent expenses={expenses} categories={categories} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} addCategory={addCategory} deleteCategory={deleteCategory} setIsAddCategoryFormVisible={setIsAddCategoryFormVisible} CATEGORY_COLORS={CATEGORY_COLORS}/>
      <AddCategoryForm CATEGORY_COLORS={CATEGORY_COLORS} addCategory={addCategory} isAddCategoryFormVisible={isAddCategoryFormVisible} setIsAddCategoryFormVisible={setIsAddCategoryFormVisible} />
      <header>
        <div className="logo-div">
          <h1>Pocket<span>Flow</span>.</h1>
          <h2>Expense tracking, simplified.</h2>
          <hr></hr>
        </div>
        <ul id="header-buttons-ul">
          <li>
            <p>Logged in as <b>{session.user.email || 'guest'}</b></p>
          </li>
          <li>
            <button className="logout-btn header-btn" onClick={handleLogout}>Log Out</button>
          </li>
        </ul>
      </header>
      <main className="homepage-main">
        <div className="expense-cards-container">
          <AddExpenseComponent addExpense={addExpense} categories={categories} addCategory={addCategory} setIsAddCategoryFormVisible={setIsAddCategoryFormVisible} />
          <SortBar sortCondition={sortCondition} setSortCondition={setSortCondition} />
          <ul className="expenses-ul">
            {
              visibleExpenses.length > 0 ?
              visibleExpenses.map((expense, index) => (
                  <li key={expense.id}>
                  <ExpenseCard expense={expense} addExpense={addExpense} deleteExpense={deleteExpense} categories={categories} addCategory={addCategory} setIsAddCategoryFormVisible={setIsAddCategoryFormVisible}/>
                  </li>
              )) :
              <li><div className="empty-expenses-msg">No expenses to show. Click the <strong>New Expense</strong> button to add an expense or change the filters above the chart.</div></li>
            }
          </ul>
          <p>Showing {visibleExpenses.length} expense{visibleExpenses.length == 1  ? '' : 's'}</p>
        </div>
        <div className="chart-view-container">
          <FilterBar categories={categories} dateFilter={dateFilter} timePeriodFilter={timePeriodFilter} setTimePeriodFilter={setTimePeriodFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} amountFilter={amountFilter} setAmountFilter={setAmountFilter}  />
          <div className="date-container">
            <span className="date-display">
              {timePeriodFilter == 'month' ? dateFilter.toLocaleDateString('en-us', { month: 'long', year: 'numeric' }) : dateFilter.getFullYear()}
            </span>
            <div className='date-button-div'>
              <button type='button' onClick={() => setDateFilter(prev => timePeriodFilter === 'month' ? new Date(prev.getFullYear(), prev.getMonth() - 1, prev.getDate()) : new Date(prev.getFullYear() - 1, prev.getMonth(), prev.getDate()))}><CaretLeftIcon /></button>
              <button type='button' onClick={() => setDateFilter(prev => timePeriodFilter === 'month' ? new Date(prev.getFullYear(), prev.getMonth() + 1, prev.getDate()) : new Date(prev.getFullYear() + 1, prev.getMonth(), prev.getDate()))}><CaretRightIcon /></button>
            </div>
          </div>
          <div className="amount-total-container">
            <p>Total Spent: <span className={`expense-total-span ${visibleExpenses.reduce((sum, expense) => sum + expense.amount, 0) <= monthlyBudget ? 'under-budget' : 'over-budget'}`}>${visibleExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> of <span className="budget-span">${monthlyBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          </div>
          <div className="chart-container">
            {isPieChartVisible ? <PieChart expenses={visibleExpenses} categories={categories}/> : 
            <BarChart expenses={visibleExpenses} categories={categories} dateFilter={dateFilter} timePeriodFilter={timePeriodFilter}/>}
          </div>
          <p>Chart View</p>
          <label className="chart-view-toggle">
            <input type="checkbox" checked={isPieChartVisible} onChange={handleChartToggleChange}></input>
            <div className="toggle-icons-container"><BarChartIcon className="bar-chart-icon" style={isPieChartVisible ? {fill: chartToggleInactiveColor} : {fill: chartToggleActiveColor} }/><PieChartIcon className="pie-chart-icon" style={isPieChartVisible ? {fill: chartToggleActiveColor} : {fill: chartToggleInactiveColor} }/></div>
          </label>
        </div>
      </main>
      {/* <footer>
        <p>Walker Smith 2026</p>
      </footer> */}
    </div>
  );
}

export default HomePage;
