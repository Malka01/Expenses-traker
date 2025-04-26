import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CgAdd } from "react-icons/cg";
import { MdOutlineAnalytics } from "react-icons/md";
import { CgTrending } from "react-icons/cg";
import { CgTrendingDown } from "react-icons/cg";

const Home = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("CAD");
  const [summary, setSummary] = useState({ income: 0, expenses: 0 });

  useEffect(() => {
    axios.get("http://localhost:5000/api/summary")
      .then((res) => {
        setSummary(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch summary:", err);
      });
  }, []);

  const balance = summary.income - summary.expenses;

  return (
    <div className="flex min-h-screen bg-gray-50">
      

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col items-center">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl p-[0px] font-extrabold text-indigo-600">SpendWise</h2>
          <p className="text-gray-600">
            Effortlessly track your daily expenses and take control of your
          </p>
          <p>financial life</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-2xl shadow-lg w-full max-w-xl text-center mb-8">
          <p className="text-xl font-medium">Your Balance</p>
          <p className="text-3xl font-bold text-green-300 mt-2">
            +{currency === "CAD" ? "CA$" : ""}{balance.toFixed(2)}
          </p>
        </div>

        {/* Income & Expenses */}
        <div className="flex gap-6 mb-8">
          <div className="bg-white shadow-md w-69 h-20 rounded-[6px] p-4 w-64 flex justify-between items-center">
            <div className="text-left">
              <p className="text-sm text-gray-500">Income</p>
              <p className="text-xl text-green-600 font-bold">
                {currency === "CAD" ? "CA$" : ""}{summary.income.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-2">
              <span className="text-green-600 text-xl"><CgTrending /></span>
            </div>
          </div>
          {/*new*/}
          <div className="bg-white shadow-md w-69 h-20 rounded-[6px] p-4 w-64 flex justify-between items-center">
            <div className="text-left">
              {/*<div className="bg-white shadow rounded-xl p-6 w-60 text-center">*/}
              <p className="text-sm text-gray-500">Expenses</p>
              <p className="text-xl text-red-600 font-bold">
                {currency === "CAD" ? "CA$" : ""}{summary.expenses.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-2">
              <span className="text-red-600 text-xl"><CgTrendingDown /></span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => navigate("/add")}
            className="bg-blue-600 text-white w-70 h-12 px-6 py-3 rounded-[5px]  hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            <CgAdd className="text-lg" />
            <span>Add Transaction</span>
          </button>
          <button
            onClick={() => navigate("/transactions")}
            className="bg-gray-100 text-black-700 w-70 h-12 px-6 py-3 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2"
          >
            <MdOutlineAnalytics className="text-lg"/>
            <span>View Transactions</span>
          
          </button>
        </div>

        {/* Currency Settings */}
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
