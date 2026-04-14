import React, { useState } from 'react';
import NutritionChart from '../../components/Graph/Graph';
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';
import { CheckCircle, Flame, Wheat, Beef, Droplets, Leaf } from 'lucide-react';
import { API_BASE } from '../../constants/constant';

function Nutrition({ food }) {
  const [logged, setLogged] = useState(false);
  const [quantity, setQuantity] = useState(100);
  const loggedData = useContext(UserContext);
  const { setRefreshKey } = useContext(UserContext);

  const scale = quantity / 100;

  const handleLogFood = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const payload = {
      userId: loggedData.loggedUser.userid,
      foodId: food._id,
      eatenDate: `${day}/${month}/${year}`,
      quantity: parseInt(quantity, 10),
    };

    fetch(`${API_BASE}/api/Tracking/trackFood`, {
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
          setTimeout(() => setLogged(false), 3000);
        }
      })
      .catch((err) => {
        console.error('Error logging food:', err);
      });
  };

  const macros = [
    { label: 'Calories', value: Math.round(food.calories * scale), unit: 'kcal', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
    { label: 'Carbs', value: Math.round(food.carbohydrates * scale * 10) / 10, unit: 'g', icon: Wheat, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
    { label: 'Protein', value: Math.round(food.protein * scale * 10) / 10, unit: 'g', icon: Beef, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
    { label: 'Fat', value: Math.round(food.fat * scale * 10) / 10, unit: 'g', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
    { label: 'Fiber', value: Math.round((food.fibre || food.fiber || 0) * scale * 10) / 10, unit: 'g', icon: Leaf, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
  ];

  const presets = [50, 100, 150, 200, 250, 300];

  return (
    <div className="space-y-4">
      {/* Food name */}
      <div>
        <h3 className="text-xl font-bold text-white capitalize">{food.name}</h3>
        <p className="text-zinc-400 text-sm mt-0.5">Nutritional info for {quantity}g</p>
      </div>

      {/* Quantity selector */}
      <div>
        <label className="text-sm text-zinc-400 mb-2 block">Quantity (grams)</label>
        <div className="flex gap-2 flex-wrap mb-3">
          {presets.map(p => (
            <button
              key={p}
              onClick={() => setQuantity(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${quantity === p
                ? 'bg-emerald-500 text-black'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                }`}
            >
              {p}g
            </button>
          ))}
        </div>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-32 bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Macro cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {macros.map(({ label, value, unit, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} border rounded-xl p-3 text-center`}>
            <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            <p className="text-xs text-zinc-500">{unit}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Doughnut chart */}
      <div className="bg-zinc-800/50 rounded-xl p-4">
        <NutritionChart data={food} />
      </div>

      {/* Log button */}
      <button
        onClick={handleLogFood}
        disabled={logged}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${logged
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
          : 'bg-emerald-500 hover:bg-emerald-400 text-black active:scale-[0.98]'
          }`}
      >
        {logged ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Food Logged!
          </>
        ) : (
          'Log this Food'
        )}
      </button>
    </div>
  );
}

export default Nutrition;
