import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Flame, Zap, Droplets, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

function getTodayKey() {
    const d = new Date();
    return `nutrify-activity-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadBurnData() {
    try {
        const saved = localStorage.getItem(getTodayKey());
        return saved ? JSON.parse(saved) : { exercises: [], water: 0 };
    } catch { return { exercises: [], water: 0 }; }
}

export default function ActivityHUD() {
    const { todayStats, refreshKey } = useContext(UserContext);
    const [burnData, setBurnData] = useState(loadBurnData);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Re-read burn data when refreshKey changes (food logged) or window focused
    useEffect(() => {
        setBurnData(loadBurnData());
    }, [refreshKey]);

    useEffect(() => {
        const onFocus = () => setBurnData(loadBurnData());
        window.addEventListener('focus', onFocus);
        // Poll every 5s to catch Burn page updates
        const interval = setInterval(() => setBurnData(loadBurnData()), 5000);
        return () => { window.removeEventListener('focus', onFocus); clearInterval(interval); };
    }, []);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const eaten = Math.round(todayStats.calories);
    const burnt = burnData.exercises.reduce((s, e) => s + e.calories, 0);
    const net = eaten - burnt;
    const water = burnData.water;
    const goal = (() => {
        try { return JSON.parse(localStorage.getItem('calorieGoal')) || 2000; } catch { return 2000; }
    })();

    // Don't render if not logged in / no data worth showing
    if (!eaten && !burnt && !water) {
        return (
            <div ref={ref} className="relative">
                <Link to="/burn" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-700">
                    <Zap className="w-3.5 h-3.5" />
                    Track Activity
                </Link>
            </div>
        );
    }

    const netColor = net <= goal
        ? net <= goal * 0.9 ? 'text-emerald-400' : 'text-amber-400'
        : 'text-red-400';

    return (
        <div ref={ref} className="relative">
            {/* ── Compact pill ── */}
            <button
                onClick={() => setOpen(v => !v)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-medium ${open ? 'bg-zinc-800 border-zinc-700' : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60'}`}
            >
                <span className="flex items-center gap-1 text-orange-400">
                    <Flame className="w-3.5 h-3.5" />
                    {eaten}
                </span>
                <span className="text-zinc-700">·</span>
                <span className="flex items-center gap-1 text-emerald-400">
                    <Zap className="w-3.5 h-3.5" />
                    {burnt}
                </span>
                {water > 0 && (
                    <>
                        <span className="text-zinc-700">·</span>
                        <span className="flex items-center gap-1 text-blue-400">
                            <Droplets className="w-3.5 h-3.5" />
                            {water}
                        </span>
                    </>
                )}
            </button>

            {/* ── Dropdown panel ── */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden animate-fade-in">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                        <p className="text-sm font-semibold text-white">Today's Balance</p>
                        <button onClick={() => setOpen(false)} className="text-zinc-600 hover:text-zinc-300 transition-colors">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Net calories big display */}
                        <div className="flex items-center justify-between bg-zinc-800/50 rounded-xl px-4 py-3">
                            <div>
                                <p className="text-xs text-zinc-500 mb-0.5">Net Calories</p>
                                <p className={`text-2xl font-black ${netColor}`}>{net}</p>
                                <p className="text-xs text-zinc-600">of {goal} goal</p>
                            </div>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-zinc-800">
                                {net < goal * 0.85 ? (
                                    <TrendingDown className="w-5 h-5 text-emerald-400" />
                                ) : net > goal ? (
                                    <TrendingUp className="w-5 h-5 text-red-400" />
                                ) : (
                                    <Minus className="w-5 h-5 text-amber-400" />
                                )}
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Eaten', value: eaten, unit: 'kcal', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/10' },
                                { label: 'Burnt', value: burnt, unit: 'kcal', icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                                { label: 'Water', value: water, unit: 'glass', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                            ].map(({ label, value, unit, icon: Icon, color, bg }) => (
                                <div key={label} className={`${bg} rounded-xl p-2.5 text-center`}>
                                    <Icon className={`w-3.5 h-3.5 ${color} mx-auto mb-1`} />
                                    <p className={`text-sm font-bold ${color}`}>{value}</p>
                                    <p className="text-xs text-zinc-600">{unit}</p>
                                    <p className="text-xs text-zinc-500">{label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Progress bar */}
                        <div>
                            <div className="flex justify-between text-xs text-zinc-600 mb-1.5">
                                <span>Calorie goal progress</span>
                                <span>{Math.round((net / goal) * 100)}%</span>
                            </div>
                            <div className="w-full bg-zinc-800 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full transition-all duration-500 ${net > goal ? 'bg-red-400' : net > goal * 0.85 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                    style={{ width: `${Math.min((net / goal) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Macro breakdown */}
                        {(todayStats.carbs > 0 || todayStats.protein > 0 || todayStats.fat > 0) && (
                            <div className="grid grid-cols-3 gap-2 pt-1">
                                {[
                                    { label: 'Carbs', val: todayStats.carbs, color: 'text-amber-400' },
                                    { label: 'Protein', val: todayStats.protein, color: 'text-emerald-400' },
                                    { label: 'Fat', val: todayStats.fat, color: 'text-blue-400' },
                                ].map(({ label, val, color }) => (
                                    <div key={label} className="text-center">
                                        <p className={`text-xs font-bold ${color}`}>{val}g</p>
                                        <p className="text-xs text-zinc-600">{label}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA links */}
                        <div className="flex gap-2 pt-1">
                            <Link
                                to="/track"
                                onClick={() => setOpen(false)}
                                className="flex-1 text-center text-xs py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors font-medium"
                            >
                                Log Food
                            </Link>
                            <Link
                                to="/burn"
                                onClick={() => setOpen(false)}
                                className="flex-1 text-center text-xs py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition-colors font-medium"
                            >
                                Log Activity
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
