import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import AddTransaction from './pages/AddTransaction';
import Transactions from './pages/Transactions';
import ManageTags from './pages/ManageTags';
import {CgAdd} from "react-icons/cg";
import { FiHome } from "react-icons/fi";
import { MdOutlineAnalytics } from "react-icons/md";
import { GoTag } from "react-icons/go";

function App() {
  const [showTagsPanel, setShowTagsPanel] = useState(false);

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 text-black bg-white shadow p-4 flex flex-col gap-4">
          <h1 className="text-2xl flex justify-center font-bold text-black-600 mb-6">SpendWise</h1>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded ${isActive ? 'bg-blue-600 rounded-[10px] text-white' : 'hover:bg-gray-100'
              }`
            }
          >
            <FiHome className="text-lg" />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded ${isActive ? 'bg-blue-600 rounded-[10px] text-white' : 'hover:bg-gray-100'
              }`
            }
          >
            <CgAdd className="text-lg" />
            <span>Add Transaction</span>
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded ${isActive ? 'bg-blue-600 rounded-[10px] text-white' : 'hover:bg-gray-100'
              }`
            }
          >
            <MdOutlineAnalytics className="text-lg"/>
            <span>View Expenses</span>
          </NavLink>
          <button
            onClick={() => setShowTagsPanel(true)}
            className="flex items-center text-black gap-2 px-4 py-2 rounded hover:bg-gray-100 text-left"
          >
            <GoTag className="text-lg"/>
            <span>Manage Tags</span>
          </button>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </div>

        {/* Manage Tags Sidebar */}
        {showTagsPanel && (
          <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg p-6 z-50 overflow-y-auto">
            <ManageTags onClose={() => setShowTagsPanel(false)} />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
