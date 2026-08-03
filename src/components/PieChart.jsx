import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ expenses }) {
  const CATEGORY_ORDER = ["Food & Drink", "Entertainment", "Rent/Utilities"];
  const COLOR_MAP = {
    "Food & Drink": 'rgba(255, 99, 132, 0.2)',
    "Entertainment": 'rgba(54, 162, 235, 0.2)',
    "Rent/Utilities": 'rgba(255, 206, 86, 0.2)',
    "a": 'rgba(75, 192, 192, 0.2)',
    "b": 'rgba(153, 102, 255, 0.2)',
    "c": 'rgba(255, 159, 64, 0.2)',
  };

  const BORDER_COLOR_MAP = {
    "Food & Drink": 'rgba(255, 99, 132, 1)',
    "Entertainment": 'rgba(54, 162, 235, 1)',
    "Rent/Utilities": 'rgba(255, 206, 86, 1)',
    "a": 'rgba(75, 192, 192, 1)',
    "b": 'rgba(153, 102, 255, 1)',
    "c": 'rgba(255, 159, 64, 1)',
  };

  function getDataObject() {
    if(!expenses) return;

    const categories = {};
    let total = 0;
    expenses.forEach((expense) => {
      categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });

    const categoriesArr = CATEGORY_ORDER.filter((cat) => categories[cat] > 0);
    const numArr = categoriesArr.map(cat => categories[cat]);
    const data = {
      labels: categoriesArr,
      datasets: [
        {
          label: 'Total Amount',
          data: numArr,
          backgroundColor: categoriesArr.map(cat => COLOR_MAP[cat]),
          borderColor: categoriesArr.map(cat => BORDER_COLOR_MAP[cat]),
          borderWidth: 1,
        },
      ],
    };
    return data;
  }

  const options = {
    responsive: true,
    animation: false,
  };

  return (
    <>
      {expenses.length > 0 ? 
      <Pie data={getDataObject()} options={options} /> : <p>Nothing to show.</p>}
    </>
  );
}

export default PieChart;