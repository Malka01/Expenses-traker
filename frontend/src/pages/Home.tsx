import { Layout } from "@/components/layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { ChartArea, PlusCircle } from "lucide-react";
import { FC, useCallback, useEffect, useState } from "react";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { Link } from "react-router";

const currencies = [
  { value: "CAD", label: "Canadian Dollar (CA$)" },
  { value: "USD", label: "United States Dollar ($)" },
  { value: "LKR", label: "Sri Lankan Rupee (රු)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "INR", label: "Indian Rupee (₹)" },
  { value: "AUD", label: "Australian Dollar (A$)" },
];

export const Home: FC = () => {
  const [currency, setCurrency] = useState("USD");
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  // change currency
  const handleCurrencyChange = async (value: string) => {
    axios
      .post("/api/currency", { currency: value })
      .then((res) => {
        if (res.status === 200) {
          alert("Currency changed successfully");
          setCurrency(value);
        }
      })
      .catch(() => {
        alert("Error changing currency");
      });
  };

  // get currency , current balance , income and expenses
  const getCurrency = useCallback(async () => {
    axios
      .get("/api/summary")
      .then((res) => {
        if (res.status === 200) {
          setCurrency(res.data.currency);
          setCurrentBalance(res.data?.currentBalance);
          setIncome(res.data?.income);
          setExpenses(res.data?.expenses);
        }
      })
      .catch(() => {
        alert("Error getting currency");
      });
  }, []);

  // get currency and current balance on mount
  useEffect(() => {
    getCurrency();
  }, [getCurrency]);

  return (
    <Layout>
      <div className="flex flex-col items-center w-full h-full">
        {/* title */}
        <h2 className="text-3xl font-semibold text-indigo-700 text-center">
          SpendWiser
        </h2>
        {/* description */}
        <p className="text-gray-500 max-w-md text-sm text-center mt-1 font-medium">
          SpendWiser is a personal finance management tool that helps you track
          your expenses and income.
        </p>

        {/* balance card */}
        <div className="bg-gradient-to-r flex flex-col items-center from-sky-700 to-purple-800 shadow-md rounded-lg p-4 py-10 mt-4 w-full max-w-3xl">
          <h3 className="font-medium text-white">Your Balance</h3>
          <p
            className={`text-4xl font-bold ${
              currentBalance < 0 ? "text-red-500" : "text-emerald-500"
            }`}
          >
            {currency} {currentBalance.toFixed(2)}
          </p>
        </div>

        {/* income and expenses */}
        <div className="flex gap-8 w-full max-w-3xl mt-4">
          <div className="bg-white shadow-md rounded-lg p-4 mt-4 w-full border flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="font-medium text-sm text-gray-500">Income</h3>
              <p className="text-2xl font-bold text-teal-500">
                {currency} {income.toFixed(2)}
              </p>
            </div>
            <FaArrowTrendUp className="bg-teal-200 rounded-full h-10 w-10 p-2 text-teal-500" />
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 mt-4 w-full border flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="font-medium text-sm text-gray-500">Expenses</h3>
              <p className="text-2xl font-bold text-red-500">
                {currency} {expenses.toFixed(2)}
              </p>
            </div>
            <FaArrowTrendDown className="bg-red-200 rounded-full h-10 w-10 p-2 text-red-500" />
          </div>
        </div>

        {/* link buttons */}
        <div className="flex gap-8 w-full max-w-3xl mt-8">
          <Link
            to={"/add"}
            className={
              "bg-indigo-700 text-white w-full flex gap-x-2.5 items-end justify-center font-medium text-sm px-3 py-4 rounded-sm"
            }
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Transaction</span>
          </Link>

          <Link
            to={"/add"}
            className={
              "bg-gray-200 text-black w-full flex gap-x-2.5 items-end justify-center font-medium text-sm px-3 py-4 rounded-sm"
            }
          >
            <ChartArea className="h-5 w-5" />
            <span>View Expenses</span>
          </Link>
        </div>

        {/* currency setting */}
        <div className="bg-white w-full max-w-3xl shadow-md rounded-lg p-4 mt-8 border justify-between items-center">
          <h3 className="font-medium text-sm text-black mb-2">
            Currency Settings
          </h3>
          <Select value={currency} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="w-full !ring-0">
              <SelectValue placeholder="Select Currency Type" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Layout>
  );
};
