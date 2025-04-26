import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CgAdd, CgTrending, CgTrendingDown } from "react-icons/cg";
import { MdOutlineAnalytics } from "react-icons/md";

const Home = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("CAD");
  const [summary, setSummary] = useState({ income: 0, expenses: 0 });

  useEffect(() => {
    axios.get("http://localhost:5000/api/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Failed to fetch summary:", err));
  }, []);

  const balance = summary.income - summary.expenses;

  const currencySymbol = {
    CAD: "CA$",
    USD: "$",
    LKR: "රු",
    EUR: "€",
    GBP: "£",
    INR: "₹"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-5 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl mb-2 font-extrabold p-[3] text-indigo-600">SpendWise</h2>
          <p className="mt-2 text-gray-600">Effortlessly track your daily expenses and take control of your</p>
          <p>financial life</p>
        </div>

        {/* Balance Display */}
        <div className="bg-gradient-to-r h-40 from-blue-500 to-indigo-500 text-white p-6 rounded-[9px] shadow-lg w-full max-w-xl text-center mb-8">
          <p className="text-xl font-medium">Your Balance</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? "text-green-300" : "text-red-300"} mt-2`}>
            {balance >= 0 ? "+" : "-"}{currencySymbol[currency]}{Math.abs(balance).toFixed(2)}
          </p>
        </div>

        {/* Income & Expense Cards */}
        <div className="flex gap-6 mb-8">
          <div className="bg-white shadow-md w-69 h-20 rounded-[6px] p-4 w-64 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Income</p>
              <p className="text-xl text-green-600 font-bold">
                {currencySymbol[currency]}{summary.income.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-2">
              <CgTrending className="text-green-600 text-xl" />
            </div>
          </div>

          <div className="bg-white shadow-md w-69 rounded-[6px] p-4 w-64 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Expenses</p>
              <p className="text-xl text-red-600 font-bold">
                {currencySymbol[currency]}{summary.expenses.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-2">
              <CgTrendingDown className="text-red-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => navigate("/add")}
            className="bg-blue-600 text-white w-69 h-12 px-6 py-3 rounded-[5px] hover:bg-blue-700 flex items-center space-x-2"
          >
            <CgAdd className="text-lg" />
            <span>Add Transaction</span>
          </button>
          <button
            onClick={() => navigate("/transactions")}
            className="bg-gray-100 w-69 h-12 text-black px-6 py-3 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
          >
            <MdOutlineAnalytics className="text-lg" />
            <span>View Transactions</span>
          </button>
        </div>

        {/* Currency Selector */}
        <div className="w-full max-w-xl bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Currency Settings</h3>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="CAD">CAD - Canadian Dollar (C$)</option>
            <option value="USD">USD - US Dollar ($)</option>
            <option value="LKR">LKR - Sri Lankan Rupee (රු)</option>
            <option value="EUR">EUR - Euro (€)</option>
            <option value="GBP">GBP - British Pound (£)</option>
            <option value="INR">INR - Indian Rupee (₹)</option>
          </select>
        </div>
      </main>
    </div>
  );
};

export default Home;
