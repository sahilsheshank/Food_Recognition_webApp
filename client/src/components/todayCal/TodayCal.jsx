import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Flame, Wheat, Beef, Droplets, Utensils, Target } from 'lucide-react';
import { API_BASE } from '../../constants/constant';

function TodayCal() {
    const [caloriesConsumed, setCaloriesConsumed] = useState(0);
    const [macros, setMacros] = useState({ carbs: 0, protein: 0, fat: 0 });
    const [food, setFood] = useState([]);
    const [loading, setLoading] = useState(true);
    const { loggedUser, refreshKey, calGoal, setTodayStats } = useContext(UserContext);

    useEffect(() => {
        const fetchToday = async () => {
            try {
                setLoading(true);
                const today = new Date();
                const day   = String(today.getDate()).padStart(2, '0');
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const year  = today.getFullYear();

                const res = await fetch(
                    `${API_BASE}/api/Tracking/getfood/${loggedUser.userid}/${day}-${month}-${year}`,
                    { method: 'GET' }
                );
                if (!res.ok) throw new Error();
                const data = await res.json();
                setFood(data);

                let cals = 0, carbs = 0, protein = 0, fat = 0;
                data.forEach(item => {
                    const q = item.quantity / 100;
                    cals    += item.foodId.calories * q;
                    carbs   += (item.foodId.carbohydrates || 0) * q;
                    protein += (item.foodId.protein || 0) * q;
                    fat     += (item.foodId.fat || 0) * q;
                });
                const rounded = {
                    calories: Math.round(cals),
                    carbs: Math.round(carbs),
                    protein: Math.round(protein),
                    fat: Math.round(fat),
                };
                setCaloriesConsumed(rounded.calories);
                setMacros({ carbs: rounded.carbs, protein: rounded.protein, fat: rounded.fat });
                // Push to context so ActivityHUD can read it
                setTodayStats(rounded);
            } catch {
                // silent fail
            } finally {
                setLoading(false);
            }
        };
        fetchToday();
    }, [refreshKey]);

    const goalCalories = calGoal || JSON.parse(localStorage.getItem("calorieGoal")) || 2000;
    const consumed     = Math.round(caloriesConsumed);
    const remaining    = goalCalories - consumed;
    const progress     = Math.min((consumed / goalCalories) * 100, 100);

    // SVG ring
    const radius           = 52;
    const circumference    = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
    });

    if (loading) {
        return (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-zinc-800 rounded-lg w-1/2 mb-4" />
                <div className="w-32 h-32 bg-zinc-800 rounded-full mx-auto mb-4" />
                <div className="space-y-2">
                    <div className="h-3 bg-zinc-800 rounded" />
                    <div className="h-3 bg-zinc-800 rounded w-3/4" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
                <div>
                    <h2 className="text-white font-semibold text-sm">Today's Intake</h2>
                    <p className="text-zinc-500 text-xs mt-0.5">{today}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500 bg-zinc-800 rounded-lg px-2.5 py-1.5">
                    <Target className="w-3 h-3" />
                    {goalCalories} kcal
                </div>
            </div>

            <div className="p-5 space-y-5">
                {/* Circular progress ring */}
                <div className="flex items-center justify-center">
                    <div className="relative">
                        <svg width="136" height="136" className="rotate-[-90deg]">
                            <circle cx="68" cy="68" r={radius} fill="none" stroke="#27272a" strokeWidth="10" />
                            <circle
                                cx="68" cy="68" r={radius}
                                fill="none"
                                stroke={progress >= 100 ? "#f87171" : "#10b981"}
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-700 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Flame className={`w-4 h-4 mb-0.5 ${progress >= 100 ? 'text-red-400' : 'text-emerald-400'}`} />
                            <p className={`text-2xl font-black ${progress >= 100 ? 'text-red-400' : 'text-white'}`}>{consumed}</p>
                            <p className="text-xs text-zinc-500">kcal</p>
                        </div>
                    </div>
                </div>

                {/* Cal stats row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-zinc-800/50 rounded-xl py-2.5 px-2">
                        <p className="text-base font-bold text-white">{goalCalories}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Goal</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-xl py-2.5 px-2">
                        <p className="text-base font-bold text-emerald-400">{consumed}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Eaten</p>
                    </div>
                    <div className={`rounded-xl py-2.5 px-2 ${remaining < 0 ? 'bg-red-500/10' : 'bg-zinc-800/50'}`}>
                        <p className={`text-base font-bold ${remaining < 0 ? 'text-red-400' : 'text-blue-400'}`}>
                            {Math.abs(remaining)}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">{remaining < 0 ? 'Over' : 'Left'}</p>
                    </div>
                </div>

                {/* Macros */}
                <div className="space-y-2.5">
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Macros</p>
                    {[
                        { label: 'Carbs',   value: macros.carbs,   goal: Math.round(goalCalories * 0.45 / 4), color: 'bg-amber-400',   icon: Wheat,    text: 'text-amber-400' },
                        { label: 'Protein', value: macros.protein, goal: Math.round(goalCalories * 0.3  / 4), color: 'bg-emerald-400', icon: Beef,     text: 'text-emerald-400' },
                        { label: 'Fat',     value: macros.fat,     goal: Math.round(goalCalories * 0.25 / 9), color: 'bg-blue-400',    icon: Droplets, text: 'text-blue-400' },
                    ].map(({ label, value, goal, color, icon: Icon, text }) => {
                        const pct = Math.min((value / goal) * 100, 100);
                        return (
                            <div key={label}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5">
                                        <Icon className={`w-3 h-3 ${text}`} />
                                        <span className="text-xs text-zinc-400">{label}</span>
                                    </div>
                                    <span className="text-xs text-zinc-400">{value}g / {goal}g</span>
                                </div>
                                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-1.5 rounded-full transition-all duration-700 ease-out ${color}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Food log */}
                <div>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Utensils className="w-3 h-3" />
                        Today's meals
                    </p>
                    {food && food.length > 0 ? (
                        <div className="space-y-2">
                            {food.map((item, index) => (
                                <div
                                    key={item._id || index}
                                    className="flex items-center justify-between py-2.5 px-3 bg-zinc-800/40 rounded-xl border border-zinc-800/60 hover:border-zinc-700 transition-all duration-200"
                                    style={{ animationDelay: `${index * 60}ms` }}
                                >
                                    <div>
                                        <p className="text-sm font-medium text-white capitalize leading-tight">{item.foodId.name}</p>
                                        <p className="text-xs text-zinc-500 mt-0.5">{item.quantity}g</p>
                                    </div>
                                    <span className="text-sm font-semibold text-emerald-400">
                                        {Math.round(item.foodId.calories * item.quantity / 100)} kcal
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <Utensils className="w-6 h-6 text-zinc-700 mx-auto mb-2" />
                            <p className="text-sm text-zinc-600">No meals logged yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TodayCal;
