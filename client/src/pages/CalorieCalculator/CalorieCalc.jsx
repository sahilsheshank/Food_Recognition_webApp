import { useContext, useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { UserContext } from "../../contexts/UserContext";

export default function CalorieCalculator() {
    const { setCalGoal, calGoal } = useContext(UserContext);
    const [userData, setUserData] = useState({
        age: "",
        weight: "",
        height: "",
        gender: "male",
        activity: "sedentary",
        goal: "maintain",
    });

    const activityMultiplier = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9,
    };

    // Load the calorie goal from localStorage on component mount
    useEffect(() => {
        const savedCalorieGoal = localStorage.getItem("calorieGoal");
        if (savedCalorieGoal) {
            setCalGoal({ calories: JSON.parse(savedCalorieGoal) });
        }
    }, [setCalGoal]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const calculateCalories = () => {
        const { age, weight, height, gender, activity, goal } = userData;

        // Enhanced validation
        if (!age || age <= 0 || !weight || weight <= 0 || !height || height <= 0) {
            alert("Please enter valid positive numbers for age, weight, and height!");
            return;
        }

        let bmr =
            gender === "male"
                ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
                : 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;

        let calories = bmr * activityMultiplier[activity];

        if (goal === "lose") calories -= 500;
        if (goal === "gain") calories += 500;

        const roundedCalories = Math.round(calories);
        setCalGoal({ calories: roundedCalories });
        localStorage.setItem("calorieGoal", JSON.stringify(roundedCalories));
    };

    return (
        <Layout>
            <div className="container mx-auto mt-5 p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Calorie Calculator</h1>
                {calGoal.calories === null ? (
                    <div className="space-y-4">
                        {/* Input fields */}
                        {["age", "weight", "height"].map((field) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700">
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                    {field === "age" ? " (years)" : field === "weight" ? " (kg)" : " (cm)"}
                                </label>
                                <input
                                    type="number"
                                    name={field}
                                    value={userData[field]}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-2 border rounded-lg"
                                />
                            </div>
                        ))}
                        {/* Dropdowns */}
                        {["gender", "activity", "goal"].map((field) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700">
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                <select
                                    name={field}
                                    value={userData[field]}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-2 border rounded-lg"
                                >
                                    {field === "gender" && (
                                        <>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </>
                                    )}
                                    {field === "activity" &&
                                        Object.keys(activityMultiplier).map((key) => (
                                            <option key={key} value={key}>
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </option>
                                        ))}
                                    {field === "goal" && (
                                        <>
                                            <option value="maintain">Maintain Weight</option>
                                            <option value="lose">Lose Weight</option>
                                            <option value="gain">Gain Weight</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        ))}
                        <button
                            onClick={calculateCalories}
                            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Calculate Daily Calories
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Your Daily Calorie Goal is:
                        </h2>
                        <p className="text-2xl font-bold text-blue-600">{calGoal.calories} kcal</p>
                        <button
                            onClick={() => {
                                setCalGoal({ calories: null });
                                localStorage.removeItem("calorieGoal");
                            }}
                            className="mt-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            Change Goal
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
}
