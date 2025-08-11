import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Calendar, Target, TrendingUp, Utensils, Clock } from 'lucide-react';

function TodayCal() {
    const [caloriesConsumed, setCaloriesConsumed] = useState(0);
    const [food, setFood] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const loggedData = useContext(UserContext);
    const { refreshKey } = useContext(UserContext);
    console.log('Refresh Key:', refreshKey);
    useEffect(() => {
        const todayCal = async () => {
            try {
                setLoading(true);
                const today = new Date();
                const day = String(today.getDate()).padStart(2, '0');
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const year = today.getFullYear();

                const response = await fetch(`http://localhost:8001/api/Tracking/getfood/${loggedData.loggedUser.userid}/${day}-${month}-${year}`, {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setFood(data);
                calculateTotalCalories(data);
            } catch (err) {
                console.error('Error fetching history:', err);
                setError('Failed to load today\'s data');
            } finally {
                setLoading(false);
            }
        };

        todayCal();
    }, [refreshKey]);

    const calculateTotalCalories = (data) => {
        let totalCalories = 0;
        data.forEach(item => {
            totalCalories += item.foodId.calories * (item.quantity / 100);
        });
        setCaloriesConsumed(totalCalories);
    };

    const goalCalories = JSON.parse(localStorage.getItem("calorieGoal")) || 2000;
    const remainingCalories = goalCalories - caloriesConsumed;
    const progressPercentage = Math.min((caloriesConsumed / goalCalories) * 100, 100);

    const getCurrentDate = () => {
        const today = new Date();
        return today.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded-lg mb-4 w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-600 text-2xl">⚠</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Data</h3>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Today's Nutrition</h2>
                </div>
                <p className="text-blue-100 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {getCurrentDate()}
                </p>
            </div>

            <div className="p-6">
                {/* Calorie Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* Goal Card */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-green-700 font-medium">Daily Goal</p>
                                <p className="text-xl font-bold text-green-800">{Math.round(goalCalories)} kcal</p>
                            </div>
                        </div>
                    </div>

                    {/* Consumed Card */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-4 border border-orange-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                {/* className="w-5 h-5 text-white" /> */}
                            </div>
                            <div>
                                <p className="text-sm text-orange-700 font-medium">Consumed</p>
                                <p className="text-xl font-bold text-orange-800">{Math.round(caloriesConsumed)} kcal</p>
                            </div>
                        </div>
                    </div>

                    {/* Remaining Card */}
                    <div className={`bg-gradient-to-br ${remainingCalories >= 0 ? 'from-blue-50 to-indigo-100' : 'from-red-50 to-pink-100'} rounded-xl p-4 border ${remainingCalories >= 0 ? 'border-blue-200' : 'border-red-200'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${remainingCalories >= 0 ? 'bg-blue-500' : 'bg-red-500'} rounded-lg flex items-center justify-center`}>
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className={`text-sm ${remainingCalories >= 0 ? 'text-blue-700' : 'text-red-700'} font-medium`}>
                                    {remainingCalories >= 0 ? 'Remaining' : 'Over Goal'}
                                </p>
                                <p className={`text-xl font-bold ${remainingCalories >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
                                    {Math.abs(Math.round(remainingCalories))} kcal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Daily Progress</span>
                        <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-3 rounded-full transition-all duration-500 ${progressPercentage <= 100
                                ? 'bg-gradient-to-r from-green-400 to-blue-500'
                                : 'bg-gradient-to-r from-orange-400 to-red-500'
                                }`}
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Food List */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <Utensils className="w-5 h-5 text-gray-600" />
                        <h3 className="text-xl font-bold text-gray-800">Today's Meals</h3>
                    </div>

                    {food && food.length > 0 ? (
                        <div className="space-y-3">
                            {food.map((item, index) => (
                                <div
                                    key={item._id}
                                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 text-lg mb-1">
                                                {item.foodId.name}
                                            </h4>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    Quantity: {item.quantity}g
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    {Math.round(item.foodId.calories * (item.quantity / 100))} kcal
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                #{index + 1}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Utensils className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-600 mb-2">No meals logged today</h4>
                            <p className="text-gray-500">Start tracking your nutrition by adding your first meal!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TodayCal;