import { useState } from 'react';

// Dummy data
const transactionsData = [
  { id: 1, type: 'income', description: 'Salary', amount: 5000, date: '2025-04-01', tag: 'Work' },
  { id: 2, type: 'expense', description: 'Groceries', amount: 150, date: '2025-04-03', tag: 'Food' },
  { id: 3, type: 'expense', description: 'Electricity Bill', amount: 80, date: '2025-04-05', tag: 'Utilities' },
];

const Transactions = () => {
  const [transactions] = useState(transactionsData);
  const [typeFilter, setTypeFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  const filtered = transactions.filter((t) => {
    return (
      (typeFilter === '' || t.type === typeFilter) &&
      (tagFilter === '' || t.tag.toLowerCase().includes(tagFilter.toLowerCase()))
    );
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">All Transactions</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
      <input
          type="text"
          placeholder="Search transaction"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="border rounded px-4 py-2 flex-grow"
        />
      </div>
      <div className='gap-5 mb-6'>
      <select
          className="border rounded px-4 py-2"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          className="border rounded px-4 py-2"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="Gthan">Greater than</option>
          <option value="Lthan">Less than</option>
          
        </select>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((txn) => (
            <div
              key={txn.id}
              className={`p-4 rounded shadow flex justify-between items-center ${
                txn.type === 'income' ? 'bg-green-50 border-l-4 border-green-400' : 'bg-red-50 border-l-4 border-red-400'
              }`}
            >
              <div>
                <div className="font-medium text-lg">{txn.description}</div>
                <div className="text-sm text-gray-600">{txn.date} • #{txn.tag}</div>
              </div>
              <div
                className={`text-xl font-semibold ${
                  txn.type === 'income' ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {txn.type === 'income' ? '+' : '-'}${txn.amount}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
