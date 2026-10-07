import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';

import ExpenseCard from '../components/ExpenseCard';
import AddExpenseComponent from '../components/AddExpenseComponent';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import SortBar from '../components/SortBar';
import AddCategoryForm from '../components/AddCategoryForm';
import FilterBar from '../components/FilterBar';
import CategoriesComponent from '../components/CategoriesComponent';
import BudgetComponent from '../components/BudgetComponent';
import AddBudgetComponent from '../components/AddBudgetComponent';
import ExpensesComponent from '../components/ExpensesComponent'

import EditIcon from '../assets/edit-icon.svg?react';
import DeleteIcon from '../assets/trash-icon.svg?react';
import PieChartIcon from '../assets/pie-chart-fill.svg?react';
import BarChartIcon from '../assets/bar-chart-fill.svg?react';
import LineChartIcon from '../assets/graph-up-arrow.svg?react';
import CaretLeftIcon from '../assets/caret-left-fill.svg?react';
import CaretRightIcon from '../assets/caret-right-fill.svg?react';
import SaveIcon from '../assets/check-lg-icon.svg?react';
import WalletIcon from '../assets/wallet.svg?react';
import ProfileIcon from '../assets/person-circle.svg?react';

const CATEGORY_COLORS = [
  '#FFBE0B',
  '#FB5607',
  '#FF006E',
  '#733e41',
  '#ab7eeb',
  '#6e07f5',
  '#7cd1e8',
  '#3A86FF',
  '#4557f8',
  '#b6ff18',
  '#e3e1a1',
  '#a04d24',
];

function HomePage() {

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleExpenses, setVisibleExpenses] = useState([]);
  const [timePeriodFilter, setTimePeriodFilter] = useState('month');
  const [dateFilter, setDateFilter] = useState(new Date());
  const [allMonthlyBudgets, setAllMonthlyBudgets] = useState([]);
  const [allCategoryBudgets, setAllCategoryBudgets] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(new Set());
  const [amountFilter, setAmountFilter] = useState(1000000);
  const [sortCondition, setSortCondition] = useState('date-ascending'); // options: date, amount
  const [isPieChartVisible, setIsPieChartVisible] = useState(false);
  const [isAddCategoryFormVisible, setIsAddCategoryFormVisible] = useState(false);
  const [isBudgetEditable, setIsBudgetEditable] = useState(false);
  const [editableBudgetText, setEditableBudgetText] = useState('');
  const [activeChartView, setActiveChartView] = useState('line');
  const [isAddBudgetComponentOpen, setIsAddBudgetComponentOpen] = useState(false);
  const [isAddExpenseFormOpen, setIsAddExpenseFormOpen] = useState(false);
  const [isEditExpenseForm, setIsEditExpenseForm] = useState(false);
  const [editableExpense, setEditableExpense] = useState(null);

  const { session } = useAuth();
  const navigate = useNavigate();
  
  const rootStyles = window.getComputedStyle(document.body);
  const chartToggleInactiveColor = rootStyles.getPropertyValue('--text').trim();
  const chartToggleActiveColor = rootStyles.getPropertyValue('--text-h').trim();
  
  useEffect(() => {
    getExpenses();
    getCategories();
    getAllMonthlyBudgets();
    getAllCategoryBudgets();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      setCategoryFilter(new Set(categories.map((category) => category.id)));
    }
  }, [categories]);

  useEffect(updateVisibleExpenses,[expenses, dateFilter, timePeriodFilter, categoryFilter, amountFilter, sortCondition]);

  useEffect(() => {setIsBudgetEditable(false)}, [dateFilter, timePeriodFilter]);

  const formattedDateFilter = useMemo(() => {
    return `${dateFilter.getFullYear()}-${String(dateFilter.getMonth() + 1).padStart(2, '0')}-01`;
  }, [dateFilter]);

  const monthlyBudgets = useMemo(() => {
    if(timePeriodFilter === 'month') {
      const targetMonth = formattedDateFilter;
      const match = allMonthlyBudgets.find((row) => {
        return row.month === targetMonth;
      })
      return [match?.amount ?? 0];
    }
    else if(timePeriodFilter === 'year') {
      const match = Array.from({ length: 12 }, (_, index) => {
        const targetMonth = `${dateFilter.getFullYear()}-${String(index + 1).padStart(2, '0')}-01`;
        const match = allMonthlyBudgets.find((row) => {
          return row.month === targetMonth;
        })
        return match?.amount ?? 0;      
      });
      return match ?? [];
    }

  }, [allMonthlyBudgets, dateFilter, timePeriodFilter]);

  const monthlyBudgetsTotal = useMemo(() => {
    return monthlyBudgets.reduce((sum, budget) => sum + budget, 0);
  }, [monthlyBudgets]);

  const budgetRemaining = useMemo(() => {
    return monthlyBudgetsTotal - visibleExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [visibleExpenses, monthlyBudgetsTotal]);

  const categoryBudgets = useMemo(() => {
    if(timePeriodFilter === 'month') {
      const targetMonth = formattedDateFilter;
      const matches = allCategoryBudgets.filter((row) => {
        return row.month === targetMonth;
      })
      return matches ?? [];
    }
    else if(timePeriodFilter === 'year') {
      const matches = Array.from({ length: 12 }, (_, index) => {
        const targetMonth = `${dateFilter.getFullYear()}-${String(index + 1).padStart(2, '0')}-01`;
        const matches = allCategoryBudgets.filter((row) => {
          return row.month === targetMonth;
        })
        return matches ?? [];
      });
      return matches ?? [];
    }

  }, [allCategoryBudgets, dateFilter, timePeriodFilter]);

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

  async function getAllMonthlyBudgets() {
  const { data, error } = await supabase
      .from('monthly_budgets')
      .select();

    if (error) {
      console.error(error);
      return 0;
    }

    setAllMonthlyBudgets(data);
  }

  async function getAllCategoryBudgets() {
  const { data, error } = await supabase
      .from('category_budgets')
      .select();

    if (error) {
      console.error(error);
      return 0;
    }

    setAllCategoryBudgets(data);
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

  async function addBudget(month, amount) {
    const monthKey = typeof month === 'string' ? month : formattedDateFilter;

    const { data, error } = await supabase
      .from('monthly_budgets')
      .upsert(
      { month: monthKey, amount: Number(amount) || 0 },
      { onConflict: 'user_id,month' }
    );

    if (error) {
      console.error(error);
      return;
    }

    getAllMonthlyBudgets();
  }

  async function deleteBudget() {
    const response = await supabase.from('monthly_budgets').delete().eq('month', formattedDateFilter);
    
    getAllMonthlyBudgets();
  }

  async function addCategoryBudgets(month, percentages) {
    const monthKey = typeof month === 'string' ? month : formattedDateFilter;

    const rows = Object.entries(percentages).map(([categoryId, amount]) => ({
      categoryId: Number(categoryId),
      month: monthKey,
      amount: Number(amount) || 0,
    }));

    const { error } = await supabase
      .from('category_budgets')
      .upsert(rows, { onConflict: 'user_id,categoryId,month' });

    if (error) {
      console.error(error);
      return false;
    }

    await getAllCategoryBudgets();
    return true;
  }

  function handleEditBudgetClick() {
    if(isBudgetEditable) {
      setIsBudgetEditable(false);
      addBudget(formattedDateFilter, editableBudgetText);
    }
    else {
      setIsBudgetEditable(true);
      setEditableBudgetText(monthlyBudgets[0]);
    }
  }

  function handleDeleteBudgetClick() {
    deleteBudget();
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
      {isAddBudgetComponentOpen && (
        <div className='modal-backdrop' onClick={() => setIsAddBudgetComponentOpen(false)}>
          <div className='modal' onClick={(e) => e.stopPropagation()}>
            <AddBudgetComponent categories={categories} monthlyBudgets={monthlyBudgets} addBudget={addBudget} categoryBudgets={categoryBudgets} addCategoryBudgets={addCategoryBudgets} dateFilter={dateFilter} timePeriodFilter={timePeriodFilter} setIsAddCategoryFormVisible={setIsAddCategoryFormVisible} setIsAddBudgetComponentOpen={setIsAddBudgetComponentOpen} onClose={() => setIsAddBudgetComponentOpen(false)} />
          </div>
        </div>
      )}
      <CategoriesComponent expenses={expenses} categories={categories} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} addCategory={addCategory} deleteCategory={deleteCategory} setIsAddCategoryFormVisible={setIsAddCategoryFormVisible} CATEGORY_COLORS={CATEGORY_COLORS}/>
      <AddCategoryForm CATEGORY_COLORS={CATEGORY_COLORS} addCategory={addCategory} isAddCategoryFormVisible={isAddCategoryFormVisible} setIsAddCategoryFormVisible={setIsAddCategoryFormVisible} />
      <header className='homepage-header'>
        <div className='logo-div' >
          <h2 className='logo-title' >Pocket<span>Flow</span><WalletIcon  className='wallet-icon' /></h2>
          <h3 className='logo-subtitle' >Expense tracking, simplified.</h3>
        </div>
        <div className='header-buttons-div'>          
          <span className='profile-span'>
            <ProfileIcon />
            <p>{session.user.email || 'guest'}</p>
          </span>
          <button title='Log out of your account' className="logout-btn header-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </header>
      <main className='homepage-main'>
        <div className='chart-view-container'>
          <BudgetComponent visibleExpenses={visibleExpenses} categories={categories} monthlyBudgetsTotal={monthlyBudgetsTotal} budgetRemaining={budgetRemaining} categoryBudgets={categoryBudgets} timePeriodFilter={timePeriodFilter} setTimePeriodFilter={setTimePeriodFilter} dateFilter={dateFilter} setDateFilter={setDateFilter} onEditBudget={() => setIsAddBudgetComponentOpen(true)} />
          <div className='chart-container'>
            {activeChartView ==='pie' && <PieChart expenses={visibleExpenses} categories={categories} monthlyBudgetsTotal={monthlyBudgetsTotal} />}
            {activeChartView ==='bar' && <BarChart expenses={visibleExpenses} categories={categories} dateFilter={dateFilter} timePeriodFilter={timePeriodFilter} monthlyBudgets={monthlyBudgets} monthlyBudgetsTotal={monthlyBudgetsTotal} budgetRemaining={budgetRemaining} categoryBudgets={categoryBudgets} />}
            {activeChartView ==='line' && <LineChart expenses={visibleExpenses} categories={categories} dateFilter={dateFilter} timePeriodFilter={timePeriodFilter} monthlyBudgets={monthlyBudgets} monthlyBudgetsTotal={monthlyBudgetsTotal} budgetRemaining={budgetRemaining} />}
          </div>
          <div className="chart-view-toggle">
            <div className="toggle-icons-container">
              <label title='Click to view line chart' className={`line-chart-toggle ${activeChartView === 'line' ? 'active' : ''}`}>
                <input type='radio' value='line' checked={activeChartView === 'line'} onChange={(e) => setActiveChartView('line')}/><LineChartIcon className='line-chart-icon' />
              </label>
              <label title='Click to view bar chart' className={`bar-chart-toggle ${activeChartView === 'bar' ? 'active' : ''}`}>
                <input type='radio' value='bar' checked={activeChartView === 'bar'} onChange={(e) => setActiveChartView('bar')} /><BarChartIcon className='bar-chart-icon' />
              </label>
              <label title='Click to view pie chart' className={`pie-chart-toggle ${activeChartView === 'pie' ? 'active' : ''}`}>
                <input type='radio' value='pie' checked={activeChartView === 'pie'} onChange={(e) => setActiveChartView('pie')} /><PieChartIcon className='pie-chart-icon' />
              </label>
            </div>
          </div>
        </div>
        <div className='expenses-container'>
          <h2>Expenses</h2>
          <AddExpenseComponent isAddExpenseFormOpen={isAddExpenseFormOpen} setIsAddExpenseFormOpen={setIsAddExpenseFormOpen} addExpense={addExpense} categories={categories} addCategory={addCategory} setIsAddCategoryFormVisible={setIsAddCategoryFormVisible} isEditExpenseForm={isEditExpenseForm}  setIsEditExpenseForm={setIsEditExpenseForm} editableExpense={editableExpense} />
          <SortBar sortCondition={sortCondition} setSortCondition={setSortCondition} />
          <ExpensesComponent visibleExpenses={visibleExpenses} categories={categories} deleteExpense={deleteExpense} setIsAddExpenseFormOpen={setIsAddExpenseFormOpen} setIsEditExpenseForm={setIsEditExpenseForm} setEditableExpense={setEditableExpense} />
          <p>{visibleExpenses.length} expense{visibleExpenses.length == 1  ? '' : 's'}</p>
        </div>
      </main>
      {/* <footer>
        <p>Walker Smith 2026</p>
      </footer> */}
    </div>
  );
}

export default HomePage;
