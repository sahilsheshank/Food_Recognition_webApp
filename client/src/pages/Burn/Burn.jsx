import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../components/Layout/Layout';
import { UserContext } from '../../contexts/UserContext';
import {
    Flame, Droplets, Plus, Minus, Trash2, Zap, Search,
    Activity, Timer, ChevronDown, ChevronUp, CheckCircle, X
} from 'lucide-react';

// ── Exercise database with MET values ─────────────────────────────────────
const EXERCISES = [
    // Cardio
    { id: 'running-fast',   name: 'Running (fast)',       category: 'Cardio',     met: 11.0, emoji: '🏃' },
    { id: 'running-mod',    name: 'Running (moderate)',   category: 'Cardio',     met: 8.3,  emoji: '🏃' },
    { id: 'walking',        name: 'Walking',              category: 'Cardio',     met: 3.8,  emoji: '🚶' },
    { id: 'cycling',        name: 'Cycling',              category: 'Cardio',     met: 8.0,  emoji: '🚴' },
    { id: 'swimming',       name: 'Swimming',             category: 'Cardio',     met: 6.0,  emoji: '🏊' },
    { id: 'jump-rope',      name: 'Jump Rope',            category: 'Cardio',     met: 11.0, emoji: '⚡' },
    { id: 'elliptical',     name: 'Elliptical',           category: 'Cardio',     met: 5.0,  emoji: '🔄' },
    { id: 'rowing',         name: 'Rowing',               category: 'Cardio',     met: 7.0,  emoji: '🚣' },
    { id: 'stair-climb',    name: 'Stair Climbing',       category: 'Cardio',     met: 8.0,  emoji: '🪜' },
    // Strength
    { id: 'weights',        name: 'Weight Training',      category: 'Strength',   met: 5.0,  emoji: '🏋️' },
    { id: 'hiit',           name: 'HIIT',                 category: 'Strength',   met: 10.5, emoji: '💥' },
    { id: 'bodyweight',     name: 'Bodyweight Training',  category: 'Strength',   met: 5.0,  emoji: '🤸' },
    { id: 'crossfit',       name: 'CrossFit',             category: 'Strength',   met: 9.5,  emoji: '⚡' },
    // Flexibility
    { id: 'yoga',           name: 'Yoga',                 category: 'Flexibility', met: 3.0, emoji: '🧘' },
    { id: 'pilates',        name: 'Pilates',              category: 'Flexibility', met: 4.0, emoji: '🧘' },
    { id: 'stretching',     name: 'Stretching',           category: 'Flexibility', met: 2.3, emoji: '🤸' },
    // Sports
    { id: 'basketball',     name: 'Basketball',           category: 'Sports',     met: 6.5,  emoji: '🏀' },
    { id: 'football',       name: 'Football / Soccer',    category: 'Sports',     met: 7.0,  emoji: '⚽' },
    { id: 'tennis',         name: 'Tennis',               category: 'Sports',     met: 7.3,  emoji: '🎾' },
    { id: 'badminton',      name: 'Badminton',            category: 'Sports',     met: 5.5,  emoji: '🏸' },
    { id: 'hiking',         name: 'Hiking',               category: 'Sports',     met: 6.0,  emoji: '🥾' },
    { id: 'dancing',        name: 'Dancing',              category: 'Sports',     met: 5.5,  emoji: '💃' },
    { id: 'cricket',        name: 'Cricket',              category: 'Sports',     met: 5.0,  emoji: '🏏' },
];

const CATEGORIES = ['All', 'Cardio', 'Strength', 'Flexibility', 'Sports'];
const WATER_GOAL = 8; // glasses per day

// ── Local storage helpers ─────────────────────────────────────────────────
function getTodayKey() {
    const d = new Date();
    return `nutrify-activity-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadTodayActivity() {
    try {
        const saved = localStorage.getItem(getTodayKey());
        return saved ? JSON.parse(saved) : { exercises: [], water: 0 };
    } catch { return { exercises: [], water: 0 }; }
}

function saveTodayActivity(data) {
    localStorage.setItem(getTodayKey(), JSON.stringify(data));
}

// ── Calories calc: MET × weight(kg) × hours ──────────────────────────────
function calcBurnt(met, durationMins, weightKg) {
    return Math.round(met * weightKg * (durationMins / 60));
}

// ── Component ─────────────────────────────────────────────────────────────
export default function Burn() {
    const { loggedUser } = useContext(UserContext);
    const savedWeight = (() => {
        try { return JSON.parse(localStorage.getItem('userData'))?.weight || 70; } catch { return 70; }
    })();

    const [activity, setActivity] = useState(loadTodayActivity);
    const [weight, setWeight] = useState(savedWeight);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [selected, setSelected] = useState(null);   // exercise picked
    const [duration, setDuration] = useState(30);
    const [showPicker, setShowPicker] = useState(false);
    const [visible, setVisible] = useState(false);
    const [justAdded, setJustAdded] = useState(false);

    // Entrance animation
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    // Persist to localStorage on change
    useEffect(() => {
        saveTodayActivity(activity);
    }, [activity]);

    const totalBurnt = activity.exercises.reduce((s, e) => s + e.calories, 0);

    const filteredExercises = EXERCISES.filter(e => {
        const matchCat = activeCategory === 'All' || e.category === activeCategory;
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const addExercise = () => {
        if (!selected) return;
        const cal = calcBurnt(selected.met, duration, weight);
        const entry = {
            id: Date.now(),
            name: selected.name,
            emoji: selected.emoji,
            category: selected.category,
            met: selected.met,
            duration,
            calories: cal,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
        setActivity(prev => ({ ...prev, exercises: [...prev.exercises, entry] }));
        setSelected(null);
        setDuration(30);
        setShowPicker(false);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
    };

    const removeExercise = (id) => {
        setActivity(prev => ({ ...prev, exercises: prev.exercises.filter(e => e.id !== id) }));
    };

    const setWater = (glasses) => {
        setActivity(prev => ({ ...prev, water: Math.max(0, Math.min(WATER_GOAL + 4, glasses)) }));
    };

    const preview = selected ? calcBurnt(selected.met, duration, weight) : 0;

    return (
        <Layout>
            <div className={`max-w-5xl mx-auto px-4 py-8 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Activity & Burn</h1>
                    <p className="text-zinc-500 text-sm mt-1">Log your workouts and water intake to track calories burnt today</p>
                </div>

                <div className="grid lg:grid-cols-[1fr_340px] gap-6">

                    {/* ── LEFT: Exercise Logger ───────────────────────── */}
                    <div className="space-y-5">

                        {/* Summary card */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-orange-500/15 rounded-xl flex items-center justify-center">
                                        <Flame className="w-4 h-4 text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Total Burnt Today</p>
                                        <p className="text-zinc-500 text-xs">{activity.exercises.length} activities logged</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-orange-400">{totalBurnt}</p>
                                    <p className="text-zinc-500 text-xs">kcal</p>
                                </div>
                            </div>

                            {/* Weight input */}
                            <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                                <p className="text-sm text-zinc-400 flex-1">Your weight (used for calc)</p>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setWeight(w => Math.max(30, w - 1))} className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all active:scale-90">
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-white font-semibold text-sm w-12 text-center">{weight} kg</span>
                                    <button onClick={() => setWeight(w => Math.min(200, w + 1))} className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all active:scale-90">
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Add exercise button */}
                        <button
                            onClick={() => setShowPicker(v => !v)}
                            className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-4 transition-all duration-200 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                    <Plus className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="text-white font-medium text-sm">Log an Exercise</span>
                            </div>
                            {showPicker ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                        </button>

                        {/* Exercise picker (expandable) */}
                        {showPicker && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 animate-fade-in">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                                    <input
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Search exercises..."
                                        className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 placeholder-zinc-600 transition-colors"
                                    />
                                </div>

                                {/* Category filter */}
                                <div className="flex gap-2 flex-wrap">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${activeCategory === cat
                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Exercise grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                                    {filteredExercises.map(ex => (
                                        <button
                                            key={ex.id}
                                            onClick={() => setSelected(selected?.id === ex.id ? null : ex)}
                                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${selected?.id === ex.id
                                                ? 'border-emerald-500/50 bg-emerald-500/10'
                                                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-800/30'
                                            }`}
                                        >
                                            <span className="text-base">{ex.emoji}</span>
                                            <div className="min-w-0">
                                                <p className={`text-xs font-medium truncate ${selected?.id === ex.id ? 'text-emerald-400' : 'text-zinc-300'}`}>
                                                    {ex.name}
                                                </p>
                                                <p className="text-xs text-zinc-600">MET {ex.met}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Duration + Add */}
                                {selected && (
                                    <div className="border-t border-zinc-800 pt-4 space-y-3 animate-fade-in">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-medium text-sm">{selected.emoji} {selected.name}</p>
                                                <p className="text-zinc-500 text-xs">MET {selected.met} · {weight}kg</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-orange-400">{preview}</p>
                                                <p className="text-xs text-zinc-500">kcal preview</p>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-sm text-zinc-400">Duration</label>
                                                <span className="text-sm font-semibold text-white">{duration} min</span>
                                            </div>
                                            <input
                                                type="range"
                                                min={5} max={120} step={5}
                                                value={duration}
                                                onChange={e => setDuration(+e.target.value)}
                                                className="w-full accent-emerald-500 h-1.5 rounded-full"
                                            />
                                            <div className="flex justify-between text-xs text-zinc-700 mt-1">
                                                <span>5 min</span><span>120 min</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setSelected(null); setSearch(''); }}
                                                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={addExercise}
                                                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add {preview} kcal
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Activity log */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-zinc-500" />
                                    <h3 className="text-white font-semibold text-sm">Today's Activities</h3>
                                </div>
                                {justAdded && (
                                    <span className="flex items-center gap-1 text-xs text-emerald-400 animate-fade-in">
                                        <CheckCircle className="w-3.5 h-3.5" /> Added!
                                    </span>
                                )}
                            </div>

                            {activity.exercises.length > 0 ? (
                                <div className="space-y-2">
                                    {activity.exercises.map((ex, i) => (
                                        <div
                                            key={ex.id}
                                            className="flex items-center justify-between py-2.5 px-3 bg-zinc-800/40 rounded-xl border border-zinc-800/60 hover:border-zinc-700 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{ex.emoji}</span>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{ex.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                            <Timer className="w-3 h-3" />{ex.duration} min
                                                        </span>
                                                        <span className="text-xs text-zinc-700">·</span>
                                                        <span className="text-xs text-zinc-600">{ex.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-orange-400">{ex.calories} kcal</span>
                                                <button
                                                    onClick={() => removeExercise(ex.id)}
                                                    className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-zinc-600 hover:text-red-400 transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <Activity className="w-7 h-7 text-zinc-700 mx-auto mb-3" />
                                    <p className="text-zinc-500 text-sm">No activities logged yet</p>
                                    <p className="text-zinc-700 text-xs mt-1">Add your first workout above</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT: Water tracker + quick stats ──────────── */}
                    <div className="space-y-5">

                        {/* Water tracker */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 bg-blue-500/15 rounded-xl flex items-center justify-center">
                                    <Droplets className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">Water Intake</p>
                                    <p className="text-zinc-500 text-xs">Goal: {WATER_GOAL} glasses / 2L</p>
                                </div>
                            </div>

                            {/* Glass grid */}
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {Array.from({ length: WATER_GOAL }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setWater(i < activity.water ? i : i + 1)}
                                        className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all duration-200 active:scale-95 ${i < activity.water
                                            ? 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                                            : 'border-zinc-800 text-zinc-700 hover:border-zinc-700'
                                        }`}
                                    >
                                        <span className="text-xl mb-0.5">{i < activity.water ? '🥤' : '🫙'}</span>
                                        <span className="text-xs">{i + 1}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Progress bar */}
                            <div className="mb-3">
                                <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                                    <span>{activity.water} of {WATER_GOAL} glasses</span>
                                    <span>{activity.water * 250}ml / {WATER_GOAL * 250}ml</span>
                                </div>
                                <div className="w-full bg-zinc-800 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                                        style={{ width: `${Math.min((activity.water / WATER_GOAL) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {activity.water >= WATER_GOAL && (
                                <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Daily water goal reached! 🎉
                                </div>
                            )}

                            {/* +/- controls */}
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => setWater(activity.water - 1)}
                                    disabled={activity.water === 0}
                                    className="flex-1 py-2 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 text-sm transition-all flex items-center justify-center gap-1"
                                >
                                    <Minus className="w-3.5 h-3.5" /> Remove
                                </button>
                                <button
                                    onClick={() => setWater(activity.water + 1)}
                                    className="flex-1 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-sm transition-all flex items-center justify-center gap-1 font-medium"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Glass
                                </button>
                            </div>
                        </div>

                        {/* Today's stats card */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Zap className="w-4 h-4 text-emerald-400" />
                                <h3 className="text-white font-semibold text-sm">Today's Overview</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: 'Calories Burnt', value: `${totalBurnt} kcal`, icon: '🔥', color: 'text-orange-400' },
                                    { label: 'Active Minutes', value: `${activity.exercises.reduce((s, e) => s + e.duration, 0)} min`, icon: '⏱', color: 'text-violet-400' },
                                    { label: 'Activities Done', value: `${activity.exercises.length}`, icon: '💪', color: 'text-emerald-400' },
                                    { label: 'Water Intake', value: `${activity.water * 250}ml`, icon: '💧', color: 'text-blue-400' },
                                ].map(({ label, value, icon, color }) => (
                                    <div key={label} className="flex items-center justify-between py-2 border-b border-zinc-800/60 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">{icon}</span>
                                            <span className="text-sm text-zinc-400">{label}</span>
                                        </div>
                                        <span className={`text-sm font-bold ${color}`}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tips card */}
                        <div className="bg-gradient-to-br from-emerald-950/40 to-zinc-900 border border-emerald-500/15 rounded-2xl p-5">
                            <p className="text-xs text-emerald-400 font-medium uppercase tracking-wider mb-2">💡 Tip</p>
                            <p className="text-sm text-zinc-300 leading-relaxed">
                                Drinking water before meals can reduce calorie intake by up to 75 kcal per meal. Staying hydrated also improves exercise performance by 20–30%.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
