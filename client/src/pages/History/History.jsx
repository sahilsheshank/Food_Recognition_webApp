import React, { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Layout from '../../components/Layout/Layout';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [date, setDate] = useState('');
  
  const loggedData = useContext(UserContext);

  const formatDate = (date) => {
    const day = ("0" + date.getDate()).slice(-2); // Adds leading zero if day is single-digit
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adds leading zero if month is single-digit
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Returns formatted date as dd-mm-yyyy
  };

  const fetchHistory = () => {
    if (!date) {
      alert('Please enter a Date.');
      return;
    }

    const formattedDate = formatDate(new Date(date)); 
    console.log(formattedDate)

    fetch(`http://localhost:8000/api/Tracking/getfood/${loggedData.loggedUser.userid}/${formattedDate}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${loggedData.loggedUser.token}`,
      },
      cache: 'no-store',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setHistory(data);
      })
      .catch((err) => {
        console.error('Error fetching history:', err);
        alert('Failed to fetch history.');
      });
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Meal History</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button
            onClick={fetchHistory}
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
          >
            Fetch History
          </button>
        </div>

        {/* Display History */}
        <div className="mt-6">
          {history.length > 0 ? (
            <ul className="space-y-4">
              {history.map((item, index) => (
                <li key={index} className="border-b pb-2">
                  <p>
                    <span className="font-semibold">Food:</span> {item.foodId.name}
                  </p>
                  <p>
                    <span className="font-semibold">Calories:</span> {item.foodId.calories}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span> {item.eatenDate}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No history found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default HistoryPage;
