import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLOR_ALPHA = "88";

function PieChart({ expenses, categories, monthlyBudgetsTotal }) {
  const CATEGORY_ORDER = [];
  const COLOR_MAP = {};
  const BORDER_COLOR_MAP = {};
  categories.forEach((category) => {
    CATEGORY_ORDER.push(category.id);
    COLOR_MAP[category.id] = category.color + COLOR_ALPHA;
    BORDER_COLOR_MAP[category.id] = category.color;
  });

   function getDataObject() {
    if(!expenses) return;

    const totalsByCategory = {}; // renamed from `categories` to avoid shadowing the prop
    expenses.forEach((expense) => {
      totalsByCategory[expense.categoryId] = (totalsByCategory[expense.categoryId] || 0) + expense.amount;
    });

    const categoriesArr = CATEGORY_ORDER.filter((cat) => totalsByCategory[cat] > 0);
    const numArr = categoriesArr.map(cat => totalsByCategory[cat]);
    const labelsArr = categoriesArr.map(
      cat => categories.find(category => category.id === cat)?.category ?? 'Unknown'
    );


    const budgetRemaining = monthlyBudgetsTotal - expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const data = {
      labels: [...labelsArr, 'Remaining Budget'],
      datasets: [
        {
          label: 'Total Amount',
          data: [...numArr, budgetRemaining > 0 ? budgetRemaining : 0],
          backgroundColor: [...categoriesArr.map(cat => COLOR_MAP[cat]), 'rgba(150,150,150, .3)'],
          borderColor: [...categoriesArr.map(cat => BORDER_COLOR_MAP[cat]), 'rgba(150,150,150, 0)'],
          borderWidth: 2,
        },
      ],
    };
    return data;
  }

  const options = {
    responsive: true,
    animation: true,
  };

  return (
    <>
      {expenses.length > 0 ? 
      <Pie data={getDataObject()} options={options} /> : <p>Nothing to show.</p>}
    </>
  );
}

export default PieChart;