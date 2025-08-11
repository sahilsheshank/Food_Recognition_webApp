import React, { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Layout from '../../components/Layout/Layout';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [date, setDate] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);

  const loggedData = useContext(UserContext);
  const dailyGoal = localStorage.getItem('calorieGoal') || 2000; // default if not set

  const formatDate = (date) => {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchHistory = () => {
    if (!date) {
      alert('Please enter a Date.');
      return;
    }

    const formattedDate = formatDate(new Date(date));

    fetch(`http://localhost:8001/api/Tracking/getfood/${loggedData.loggedUser.userid}/${formattedDate}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${loggedData.loggedUser.token}`,
      },
      cache: 'no-store',
    })
      .then((response) => response.json())
      .then((data) => {
        setHistory(data);
        const caloriesSum = data.reduce((sum, item) => sum + (item.foodId.calories / 100 * item.quantity), 0);
        setTotalCalories(caloriesSum);
      })
      .catch((err) => {
        console.error('Error fetching history:', err);
        alert('Failed to fetch history.');
      });
  };

  const changeDate = (days) => {
    if (!date) return;
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().split('T')[0]);

  };

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="max-w-4xl w-full p-6 bg-white shadow-xl rounded-lg space-y-6">

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 text-center">🍽 Meal History</h1>

          {/* Date Picker & Controls */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full">
              <label className="block text-gray-700 font-bold text-center mb-1">Select Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => changeDate(-1)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">⬅ Prev</button>
              <button onClick={() => changeDate(1)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Next ➡</button>
            </div>
            <button
              onClick={fetchHistory}
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
            >
              Fetch History
            </button>
          </div>

          {/* Summary */}
          {history.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm text-center">
              <h2 className="text-xl font-semibold mb-2">Daily Summary</h2>
              <p className="mb-1"><span className="font-bold">Total Calories:</span> {totalCalories.toFixed(1)} kcal</p>
              <div className="w-full bg-gray-300 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${totalCalories > dailyGoal ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min((totalCalories / dailyGoal) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1 text-gray-600">Goal: {dailyGoal} kcal</p>
            </div>
          )}

          {/* History List */}
          <div>
            {history.length > 0 ? (
              <ul className="space-y-4">
                {history.map((item, index) => (
                  <li key={index} className="border-b pb-2 text-center">
                    <p><span className="font-semibold">🥗 Food:</span> {item.foodId.name}</p>
                    <p><span className="font-semibold">🔥 Calories:</span> {(item.foodId.calories / 100 * item.quantity).toFixed(1)} kcal</p>
                    <p><span className="font-semibold">📅 Date:</span> {item.eatenDate}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>No meals logged for this date. 🍳</p>
                <p className="text-sm">Start adding your meals to see history here.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default HistoryPage;
