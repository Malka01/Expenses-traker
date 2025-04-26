import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Home } from "@/pages/Home";
import axios from "axios";

function App() {
  // setup axios
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<Home />} />
        <Route path="/expenses" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
