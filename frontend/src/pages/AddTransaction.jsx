import { useState } from 'react';

const AddTransaction = () => {
  const [type, setType] = useState('income');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [tag, setTag] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !amount || !tag) {
      setError('All fields are required including at least one tag.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/addtransactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          description,
          amount: parseFloat(amount),
          tag,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setError('');
      alert('Transaction added successfully!');

      // Reset
      setDescription('');
      setAmount('');
      setTag('');
      setType('income');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="flex-1 p-8 flex flex-col items-center">
      <div className=" w-full max-w-xl bg-white p-4 rounded-xl shadow">
        <div className="max-w-xl mx-auto p-4">
          <h2 className="text-2xl font-semibold text-left mb-6">Add New Transaction</h2>

          {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Transaction Type */}
            <div className="flex flex-col items-start gap-2">
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">Transaction Type</label>
                <div className="flex gap-6">
                <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="expense"
                      checked={type === 'expense'}
                      onChange={() => setType('expense')}
                      className="accent-blue-600"
                    />
                    Expense
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="income"
                      checked={type === 'income'}
                      onChange={() => setType('income')}
                      className="accent-red-600"
                    />
                    Income
                  </label>
                </div>
              </div>

            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-1">Description</label>
              <input
                type="text"
                placeholder="What was this transaction for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block font-medium mb-1">Amount</label>
              <input
                type="number"
                placeholder="$  0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tag */}
            <div>
              <label className="block font-medium mb-1">Tag</label>
              <input
                type="text"
                placeholder="e.g. Food"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 w-129 h-10 px-6 py-3 rounded-[10px] justify-between flex items-center  justify-center space-x-2 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
              >
                Add Transaction
              </button>
            </div>
          </form>
        </div>
      </div>

    </main>
  );
};

export default AddTransaction;
