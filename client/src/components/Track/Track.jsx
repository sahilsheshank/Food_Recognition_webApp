import { UserContext } from "../../contexts/UserContext";
import { useContext, useState, useRef, useEffect } from "react";
import { API_BASE } from "../../constants/constant";
import Nutrition from "../../pages/nutrition/nutrition";
import Layout from "../Layout/Layout";
import TodayCal from "../todayCal/TodayCal";
import { Search, X, Coffee, Sun, Moon, Apple, ChevronDown } from "lucide-react";

const MEAL_TYPES = [
    { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/25' },
    { id: 'lunch', label: 'Lunch', icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/25' },
    { id: 'dinner', label: 'Dinner', icon: Moon, color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/25' },
    { id: 'snack', label: 'Snack', icon: Apple, color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/25' },
];

export default function Track() {
    const loggedData = useContext(UserContext);
    const [foodItems, setFoodItems] = useState([]);
    const [food, setFood] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState("");
    const [activeMeal, setActiveMeal] = useState('breakfast');
    const searchRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setFoodItems([]);
                setError("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.length > 0) searchFood(searchQuery);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    function handleSearchInput(event) {
        const query = event.target.value;
        setSearchQuery(query);
        setError("");
        if (query.length === 0) {
            setFoodItems([]);
            setIsSearching(false);
        }
    }

    async function searchFood(query) {
        if (!query.trim()) return;
        setIsSearching(true);
        setError("");
        try {
            const response = await fetch(
                `${API_BASE}/api/Food/fooditem/${encodeURIComponent(query)}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${loggedData.loggedUser.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setFoodItems(data);
                if (data.length === 0) setError("No food items found");
            } else {
                setFoodItems([]);
                setError(data.message || "No food items found");
            }
        } catch {
            setFoodItems([]);
            setError("Failed to search. Please try again.");
        } finally {
            setIsSearching(false);
        }
    }

    function selectFoodItem(item) {
        setFood(item);
        setSearchQuery("");
        setFoodItems([]);
        setError("");
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Log Food</h1>
                    <p className="text-zinc-500 text-sm mt-1">Search and add what you've eaten today</p>
                </div>

                <div className="grid lg:grid-cols-[1fr_420px] gap-6">

                    {/* LEFT: Search + Food detail */}
                    <div className="space-y-5">

                        {/* Meal type selector */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-3">Meal</p>
                            <div className="grid grid-cols-4 gap-2">
                                {MEAL_TYPES.map(({ id, label, icon: Icon, color, bg }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveMeal(id)}
                                        className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all ${
                                            activeMeal === id
                                                ? `${bg} border-opacity-100`
                                                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-800/30'
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 ${activeMeal === id ? color : 'text-zinc-500'}`} />
                                        <span className={`text-xs font-medium ${activeMeal === id ? color : 'text-zinc-500'}`}>{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search box */}
                        <div className="relative" ref={searchRef}>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={handleSearchInput}
                                    placeholder="Search food item (e.g. rice, chicken, banana...)"
                                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-2xl pl-11 pr-11 py-3.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder-zinc-600 text-sm"
                                    autoComplete="off"
                                />
                                {isSearching && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500" />
                                    </div>
                                )}
                                {searchQuery && !isSearching && (
                                    <button
                                        onClick={() => { setSearchQuery(""); setFoodItems([]); setError(""); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Dropdown */}
                            {searchQuery && (foodItems.length > 0 || error) && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto">
                                    {error && (
                                        <div className="p-4 text-zinc-500 text-sm text-center">{error}</div>
                                    )}
                                    {foodItems.map((item, index) => (
                                        <button
                                            key={item._id || index}
                                            className="w-full flex items-center justify-between p-3.5 hover:bg-zinc-800 transition-colors border-b border-zinc-800/50 last:border-0 text-left"
                                            onClick={() => selectFoodItem(item)}
                                        >
                                            <span className="text-white font-medium text-sm capitalize">{item.name}</span>
                                            {item.calories && (
                                                <span className="text-xs text-zinc-500 ml-2 flex-shrink-0">{item.calories} kcal/100g</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected Food Details */}
                        {food ? (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const meal = MEAL_TYPES.find(m => m.id === activeMeal);
                                            const Icon = meal.icon;
                                            return <Icon className={`w-4 h-4 ${meal.color}`} />;
                                        })()}
                                        <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                                            {MEAL_TYPES.find(m => m.id === activeMeal)?.label}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setFood(null)}
                                        className="text-zinc-600 hover:text-zinc-300 transition-colors p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <Nutrition food={food} />
                            </div>
                        ) : (
                            <div className="bg-zinc-900/50 border border-zinc-800/50 border-dashed rounded-2xl p-12 text-center">
                                <Search className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                                <p className="text-zinc-500 text-sm">Search for a food item above to see its nutrition details</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Today's calories */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <TodayCal />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
