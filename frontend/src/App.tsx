import { BrowserRouter as Router, Routes, Route } from "react-router";
import axios from "axios";
import { Home } from "@/pages/Home";
import { AddTransactions } from "@/pages/AddTransactions";
import { ViewExpenses } from "./pages/ViewExpenses";

function App() {
  // setup axios
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddTransactions />} />
        <Route path="/expenses" element={<ViewExpenses />} />
      </Routes>
    </Router>
  );
}

export default App;
