import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import NutritionChart from '../../components/Graph/Graph';
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';
import TodayCal from '../../components/todayCal/TodayCal';
function Nutrition({ food }) {
  const [userId, setUserId] = useState('');
  const [logged, setLogged] = useState(false);
  const [quantity, setQuantity] = useState(100);
  const loggedData = useContext(UserContext)

  const { setRefreshKey } = useContext(UserContext);
  const handleLogFood = () => {

    const payload = {
      userId: loggedData.loggedUser.userid,
      foodId: food._id,
      eatenDate: new Date().toLocaleDateString('en-GB'),
      quantity: quantity,
    };

    fetch('http://localhost:8001/api/Tracking/trackFood', {
      method: 'POST',

      headers: {
        "Authorization": `Bearer ${loggedData.loggedUser.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'food item added') {
          setLogged(true);
          setRefreshKey(prev => prev + 1);
        } else {
          alert('Failed to log food.');
        }
      })
      .catch((err) => {
        console.error('Error logging food:', err);
        alert('Failed to log food.');
      });
  };

  return (
    <>
      <div className="container mx-auto mt-5 p-6 bg-white shadow-lg rounded-lg">
        {/* Nutrition Data */}
        <h1 className="text-2xl font-bold text-gray-800 mt-5 mb-3">
          Nutrition Data (per 100g):
        </h1>
        <div className="space-y-3">
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Name:</span> {food.name}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Calories:</span> {food.calories} kcal
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Carbohydrates:</span> {food.carbohydrates} g
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Protein:</span> {food.protein} g
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Fat:</span> {food.fat} g
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Fiber:</span> {food.fiber} g
          </p>
        </div>

        {/* Circular Graph */}
        <div className="mt-6">
          <NutritionChart data={food} />
        </div>

        {/* Quantity Selector */}
        <div className="mt-4">
          <label className="block text-gray-700 text-lg">Quantity (grams):</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Log Food Button */}
        <div className="mt-6">
          <button
            onClick={handleLogFood}
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
          >
            {logged ? 'Food Logged!' : 'Log this Food'}
          </button>

        </div>

      </div>

    </>
  );
}

export default Nutrition;
