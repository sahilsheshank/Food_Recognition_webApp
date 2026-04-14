import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Layout from '../../components/Layout/Layout';
import { API_BASE } from '../../constants/constant';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { CalendarDays, ChevronLeft, ChevronRight, Flame, Wheat, Beef, Droplets, TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// ── Timezone-safe date helpers ─────────────────────────────────────────────
function getTodayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDaysToISO(isoDate, days) {
    const [y, m, d] = isoDate.split('-').map(Number);
    const date = new Date(y, m - 1, d); // local constructor — no timezone shift
    date.setDate(date.getDate() + days);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatForAPI(isoDate) {
    const [y, m, d] = isoDate.split('-');
    return `${d}-${m}-${y}`; // DD-MM-YYYY for backend URL
}

function displayLabel(isoDate) {
    const [y, m, d] = isoDate.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
    });
}

function shortLabel(isoDate) {
    const [y, m, d] = isoDate.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' });
}
// ─────────────────────────────────────────────────────────────────────────────

function HistoryPage() {
    const todayISO = getTodayISO();
    const [history, setHistory] = useState([]);
    const [date, setDate] = useState(todayISO);
    const [totalCalories, setTotalCalories] = useState(0);
    const [macros, setMacros] = useState({ carbs: 0, protein: 0, fat: 0 });
    const [weekData, setWeekData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [weekLoading, setWeekLoading] = useState(true);
    const [visible, setVisible] = useState(false); // animation trigger

    const loggedData = useContext(UserContext);
    const dailyGoal = loggedData.calGoal || JSON.parse(localStorage.getItem('calorieGoal')) || 2000;

    const fetchForDate = async (isoDate) => {
        const formatted = formatForAPI(isoDate);
        const res = await fetch(
            `${API_BASE}/api/Tracking/getfood/${loggedData.loggedUser.userid}/${formatted}`,
            { headers: { "Authorization": `Bearer ${loggedData.loggedUser.token}` } }
        );
        return res.json();
    };

    // Trigger entrance animation
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    // Fetch selected date
    useEffect(() => {
        if (!date) return;
        setLoading(true);
        fetchForDate(date)
            .then(data => {
                const items = Array.isArray(data) ? data : [];
                setHistory(items);
                let cals = 0, carbs = 0, protein = 0, fat = 0;
                items.forEach(item => {
                    const q = item.quantity / 100;
                    cals  += item.foodId.calories * q;
                    carbs += (item.foodId.carbohydrates || 0) * q;
                    protein += (item.foodId.protein || 0) * q;
                    fat   += (item.foodId.fat || 0) * q;
                });
                setTotalCalories(cals);
                setMacros({ carbs: Math.round(carbs), protein: Math.round(protein), fat: Math.round(fat) });
            })
            .catch(() => setHistory([]))
            .finally(() => setLoading(false));
    }, [date]);

    // Fetch last 7 days for weekly chart
    useEffect(() => {
        const fetchWeek = async () => {
            setWeekLoading(true);
            const results = [];
            for (let i = 6; i >= 0; i--) {
                const iso = addDaysToISO(todayISO, -i);
                try {
                    const data = await fetchForDate(iso);
                    const cals = Array.isArray(data)
                        ? data.reduce((s, item) => s + item.foodId.calories * item.quantity / 100, 0)
                        : 0;
                    results.push({ label: shortLabel(iso), calories: Math.round(cals), iso });
                } catch {
                    results.push({ label: shortLabel(iso), calories: 0, iso });
                }
            }
            setWeekData(results);
            setWeekLoading(false);
        };
        fetchWeek();
    }, []);

    const changeDate = (days) => {
        const next = addDaysToISO(date, days);
        if (next > todayISO) return; // no future dates
        setDate(next);
    };

    const isToday = date === todayISO;
    const progressPct = Math.min((totalCalories / dailyGoal) * 100, 100);

    const chartData = {
        labels: weekData.map(d => d.label),
        datasets: [{
            label: 'Calories',
            data: weekData.map(d => d.calories),
            backgroundColor: weekData.map(d =>
                d.iso === date ? 'rgba(16,185,129,0.9)' : 'rgba(16,185,129,0.2)'
            ),
            borderRadius: 6,
            borderSkipped: false,
        }],
    };

    const chartOptions = {
        responsive: true,
        onClick: (_, elements) => {
            if (elements.length > 0 && weekData[elements[0].index]) {
                setDate(weekData[elements[0].index].iso);
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: { label: (ctx) => ` ${ctx.parsed.y} kcal` },
                backgroundColor: '#18181b', borderColor: '#3f3f46', borderWidth: 1,
                titleColor: '#a1a1aa', bodyColor: '#f4f4f5',
            },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#71717a', font: { size: 11 } }, border: { display: false } },
            y: {
                grid: { color: 'rgba(63,63,70,0.4)' },
                ticks: { color: '#71717a', font: { size: 11 } },
                border: { display: false },
                suggestedMax: dailyGoal * 1.2,
            },
        },
        cursor: 'pointer',
    };

    return (
        <Layout>
            <div className={`max-w-4xl mx-auto px-4 py-8 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">History</h1>
                    <p className="text-zinc-500 text-sm mt-1">Track your progress over time</p>
                </div>

                {/* Weekly Chart */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-5 transition-all duration-300 hover:border-zinc-700">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <h2 className="text-white font-semibold text-sm">Last 7 Days</h2>
                        <span className="text-xs text-zinc-600 ml-auto">Click a bar to view that day</span>
                    </div>
                    {weekLoading ? (
                        <div className="h-28 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500" />
                        </div>
                    ) : (
                        <Bar data={chartData} options={chartOptions} height={70} />
                    )}
                    <p className="text-xs text-zinc-600 mt-1 text-right">Goal: {dailyGoal} kcal/day</p>
                </div>

                {/* Date Navigator */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-5 transition-all duration-300 hover:border-zinc-700">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => changeDate(-1)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all active:scale-95"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex-1 text-center">
                            <p className="text-white font-semibold text-sm">
                                {isToday ? 'Today' : displayLabel(date)}
                            </p>
                            {isToday && (
                                <p className="text-zinc-500 text-xs mt-0.5">{displayLabel(date)}</p>
                            )}
                        </div>

                        <button
                            onClick={() => changeDate(1)}
                            disabled={isToday}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-25 disabled:cursor-not-allowed text-zinc-400 hover:text-white transition-all active:scale-95"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        <input
                            type="date"
                            value={date}
                            max={todayISO}
                            onChange={(e) => { if (e.target.value <= todayISO) setDate(e.target.value); }}
                            className="nutrify-input w-auto text-xs px-3 py-2"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500" />
                    </div>
                ) : (
                    <div className={`space-y-4 transition-all duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                        {/* Summary */}
                        {history.length > 0 && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 animate-fade-in">
                                <h3 className="text-white font-semibold mb-4 text-sm">Daily Summary</h3>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <Flame className="w-3.5 h-3.5 text-orange-400" />
                                            <span className="text-sm text-zinc-300">Calories</span>
                                        </div>
                                        <span className={`text-sm font-bold ${totalCalories > dailyGoal ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {Math.round(totalCalories)} <span className="text-zinc-600 font-normal">/ {dailyGoal} kcal</span>
                                        </span>
                                    </div>
                                    <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-700 ease-out ${totalCalories > dailyGoal ? 'bg-red-400' : 'bg-emerald-400'}`}
                                            style={{ width: `${progressPct}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'Carbs', value: macros.carbs, icon: Wheat, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                                        { label: 'Protein', value: macros.protein, icon: Beef, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                                        { label: 'Fat', value: macros.fat, icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                    ].map(({ label, value, icon: Icon, color, bg }) => (
                                        <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                                            <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                                            <p className={`font-bold ${color}`}>{value}g</p>
                                            <p className="text-xs text-zinc-500">{label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Food list */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <CalendarDays className="w-4 h-4 text-zinc-500" />
                                <h3 className="text-white font-semibold text-sm">Meals logged</h3>
                                {history.length > 0 && (
                                    <span className="ml-auto text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                                        {history.length} items
                                    </span>
                                )}
                            </div>
                            {history.length > 0 ? (
                                <div className="space-y-2">
                                    {history.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between py-2.5 px-3 bg-zinc-800/40 rounded-xl border border-zinc-800/60 hover:border-zinc-700 transition-all duration-200 hover:translate-x-0.5"
                                            style={{ animationDelay: `${i * 60}ms` }}
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-white capitalize">{item.foodId.name}</p>
                                                <p className="text-xs text-zinc-500 mt-0.5">{item.quantity}g</p>
                                            </div>
                                            <span className="text-sm font-semibold text-emerald-400">
                                                {(item.foodId.calories / 100 * item.quantity).toFixed(0)} kcal
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <CalendarDays className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                                    <p className="text-zinc-500 text-sm">No meals logged for this day</p>
                                    <p className="text-zinc-700 text-xs mt-1">Start adding your meals to see history here</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default HistoryPage;
