import { UserContext } from "../../contexts/UserContext";
import { useContext, useState, useRef, useEffect } from "react";
import Nutrition from "../../pages/nutrition/nutrition";
import Layout from "../Layout/Layout";
import TodayCal from "../todayCal/TodayCal";

export default function Track() {
    const loggedData = useContext(UserContext);
    const [foodItems, setFoodItems] = useState([]);
    const [food, setFood] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState("");
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setFoodItems([]);
                setError("");
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Debounced search function
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.length > 0) {
                searchFood(searchQuery);
            }
        }, 300); // 300ms debounce

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
            const response = await fetch(`http://localhost:8001/api/Food/fooditem/${encodeURIComponent(query)}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${loggedData.loggedUser.token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.message === undefined && Array.isArray(data)) {
                setFoodItems(data);
                if (data.length === 0) {
                    setError("No food items found");
                }
            } else {
                setFoodItems([]);
                setError(data.message || "No food items found");
            }
        } catch (err) {
            console.error("Search error:", err);
            setFoodItems([]);
            setError("Failed to search food items. Please try again.");
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

    function clearSelection() {
        setFood(null);
    }

    return (
        <Layout>
            <section className="w-full max-w-full flex flex-col mx-auto p-4 space-y-6">
                {/* Search Section */}
                <div className="relative" ref={searchRef}>
                    <div className="relative">
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={handleSearchInput}
                            placeholder="Search Food Item (e.g., apple, chicken, rice...)"
                            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            autoComplete="off"
                        />

                        {/* Loading spinner */}
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                            </div>
                        )}

                        {/* Clear button */}
                        {searchQuery && !isSearching && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setFoodItems([]);
                                    setError("");
                                }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Dropdown Results */}
                    {searchQuery && (foodItems.length > 0 || error) && (
                        <div
                            ref={dropdownRef}
                            className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto z-50"
                        >
                            {error && (
                                <div className="p-3 text-gray-500 text-center border-b border-gray-100">
                                    {error}
                                </div>
                            )}

                            {foodItems.map((item, index) => (
                                <div
                                    key={item._id || index}
                                    className="p-3 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 group"
                                    onClick={() => selectFoodItem(item)}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-900 group-hover:text-blue-600">
                                            {item.name}
                                        </span>
                                        {item.calories && (
                                            <span className="text-sm text-gray-500">
                                                {item.calories} cal
                                            </span>
                                        )}
                                    </div>
                                    {item.brand && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            {item.brand}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Food Details */}
                <div className="flex gap-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                    {food && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Selected Food Item
                                </h3>
                                <button
                                    onClick={clearSelection}
                                    className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
                                >
                                    ✕ Clear
                                </button>
                            </div>
                            <Nutrition food={food} />
                        </div>
                    )}

                    {/* Today's Calories */}
                    <TodayCal />
                </div>
            </section>
        </Layout>
    );
}