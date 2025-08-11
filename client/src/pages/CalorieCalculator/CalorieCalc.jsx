import { useContext, useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { UserContext } from "../../contexts/UserContext";
import axios from "axios";

export default function CalorieCalculator() {
    const { setCalGoal, calGoal, loggedUser } = useContext(UserContext);
    const [userData, setUserData] = useState({
        age: "",
        weight: "",
        goalWeight: "",
        height: "",
        gender: "male",
        activity: "sedentary",
    });

    const [calorieOptions, setCalorieOptions] = useState(null);
    const [selectedGoal, setSelectedGoal] = useState(null); // New state to track selected goal

    const activityMultiplier = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9,
    };

    useEffect(() => {
        localStorage.setItem("userData", JSON.stringify(userData));
    }, [userData]);



    // Load saved calorie goal on mount
    useEffect(() => {
        const savedCalorieGoal = localStorage.getItem("calorieGoal");
        if (savedCalorieGoal) {
            const parsedGoal = JSON.parse(savedCalorieGoal);
            setCalGoal(parsedGoal);
            setSelectedGoal(parsedGoal.calories); // Store selected goal
        }
    }, [setCalGoal]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setUserData({ ...userData, [name]: value });
    };

    const calculateCalories = () => {
        const { age, weight, goalWeight, height, gender, activity } = userData;

        axios.put(`http://localhost:8001/api/Auth/userData/${loggedUser.userid}`, {
            age: age,
            weight: weight,
            goalWeight: goalWeight,
            height: height,
            gender: gender,
            activity: activity,
        })
            .then((res) => {
                console.log(res);
            })

        if (!age || !weight || !goalWeight || !height || age <= 0 || weight <= 0 || goalWeight <= 0 || height <= 0) {
            alert("Please enter valid positive numbers for age, weight, goal weight, and height!");
            return;
        }

        let bmr =
            gender === "male"
                ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
                : 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;

        let maintenanceCalories = bmr * activityMultiplier[activity];

        const calorieData = {
            maintain: Math.round(maintenanceCalories),
            mildLoss: Math.round(maintenanceCalories - 250),
            weightLoss: Math.round(maintenanceCalories - 500),
            extremeLoss: Math.round(maintenanceCalories - 1000),
            weightGain: Math.round(maintenanceCalories + 500),
        };
        setCalorieOptions(calorieData);
    };

    const handleSetGoal = (calorie) => {
        setCalGoal({ calories: calorie });
        setSelectedGoal(calorie);
        localStorage.setItem("calorieGoal", JSON.stringify(calorie));
        setCalorieOptions(null);
    };

    return (
        <Layout>
            <div className="container mx-auto mt-5 p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Calorie Calculator</h1>

                {/* Show selected calorie goal if already set */}
                {calGoal ? (
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
                        <h2 className="text-lg font-semibold text-gray-700">Your Selected Goal:</h2>
                        <p className="text-2xl font-bold text-blue-600">{localStorage.getItem("calorieGoal")} kcal/day</p>
                        <button
                            onClick={() => {

                                setSelectedGoal(null);
                                setCalGoal(null);
                                localStorage.removeItem("calorieGoal");
                            }}
                            className="mt-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            Recalculate
                        </button>
                    </div>
                ) : (
                    //if no calorie goal is set
                    <>
                        {!calorieOptions ? (
                            <div className="space-y-4">
                                {["age", "weight", "goalWeight", "height"].map((field) => (
                                    <div key={field}>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {field === "goalWeight"
                                                ? "Goal Weight (kg)"
                                                : field.charAt(0).toUpperCase() + field.slice(1) + (field === "age" ? " (years)" : " (kg/cm)")}
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                    <select
                                        name="gender"
                                        value={userData.gender}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border rounded-lg"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Activity Level</label>
                                    <select
                                        name="activity"
                                        value={userData.activity}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border rounded-lg"
                                    >
                                        {Object.keys(activityMultiplier).map((key) => (
                                            <option key={key} value={key}>
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={calculateCalories}
                                    className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    Calculate Daily Calories
                                </button>
                            </div>
                        ) : (
                            // calorie options
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
                                <h2 className="text-lg font-semibold text-gray-700">
                                    Choose Your Daily Calorie Goal:
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    {[
                                        { label: "Maintain weight", value: calorieOptions.maintain },
                                        { label: "Mild weight loss (0.25 kg/week)", value: calorieOptions.mildLoss },
                                        { label: "Weight loss (0.5 kg/week)", value: calorieOptions.weightLoss },
                                        { label: "Extreme weight loss (1 kg/week)", value: calorieOptions.extremeLoss },
                                        { label: "Weight gain (0.5 kg/week)", value: calorieOptions.weightGain },
                                    ].map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSetGoal(option.value)}
                                            className="p-3 bg-white border rounded-lg shadow hover:bg-blue-500 hover:text-white transition"
                                        >
                                            {option.label}: <span className="font-bold">{option.value} kcal/day</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}
