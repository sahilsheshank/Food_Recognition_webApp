import { useContext, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { UserContext } from "../../contexts/UserContext";
import axios from "axios";
import { API_BASE } from "../../constants/constant";
import { Calculator, ChevronRight, RefreshCw, Target, TrendingDown, TrendingUp, Minus, Flame } from "lucide-react";

const ACTIVITY_OPTIONS = [
    { value: "sedentary", label: "Sedentary", description: "Little or no exercise" },
    { value: "light", label: "Lightly Active", description: "Exercise 1–3 days/week" },
    { value: "moderate", label: "Moderately Active", description: "Exercise 3–5 days/week" },
    { value: "active", label: "Very Active", description: "Hard exercise 6–7 days/week" },
    { value: "veryActive", label: "Extra Active", description: "Physical job + hard exercise" },
];

const ACTIVITY_MULTIPLIER = {
    sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9,
};

const GOAL_OPTIONS = [
    { key: "extremeLoss", label: "Extreme Weight Loss", desc: "Lose ~1 kg/week", icon: TrendingDown, color: "text-red-400", border: "border-red-500/20 hover:border-red-500/40 bg-red-500/5" },
    { key: "weightLoss", label: "Weight Loss", desc: "Lose ~0.5 kg/week", icon: TrendingDown, color: "text-orange-400", border: "border-orange-500/20 hover:border-orange-500/40 bg-orange-500/5" },
    { key: "mildLoss", label: "Mild Weight Loss", desc: "Lose ~0.25 kg/week", icon: TrendingDown, color: "text-amber-400", border: "border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5" },
    { key: "maintain", label: "Maintain Weight", desc: "Keep current weight", icon: Minus, color: "text-blue-400", border: "border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5" },
    { key: "weightGain", label: "Weight Gain", desc: "Gain ~0.5 kg/week", icon: TrendingUp, color: "text-emerald-400", border: "border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/5" },
];

export default function CalorieCalculator() {
    const { setCalGoal, calGoal, loggedUser } = useContext(UserContext);
    const [userData, setUserData] = useState({
        age: "", weight: "", goalWeight: "", height: "", gender: "male", activity: "sedentary",
    });
    const [calorieOptions, setCalorieOptions] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const calculateCalories = () => {
        const { age, weight, goalWeight, height, gender, activity } = userData;
        if (!age || !weight || !goalWeight || !height || +age <= 0 || +weight <= 0 || +goalWeight <= 0 || +height <= 0) {
            return;
        }

        axios.put(`${API_BASE}/api/Auth/userData/${loggedUser.userid}`, {
            age, weight, goalWeight, height, gender, activity,
        }).catch(() => {});

        const bmr = gender === "male"
            ? 88.362 + 13.397 * +weight + 4.799 * +height - 5.677 * +age
            : 447.593 + 9.247 * +weight + 3.098 * +height - 4.330 * +age;

        const maintenance = bmr * ACTIVITY_MULTIPLIER[activity];

        setCalorieOptions({
            maintain: Math.round(maintenance),
            mildLoss: Math.round(maintenance - 250),
            weightLoss: Math.round(maintenance - 500),
            extremeLoss: Math.round(maintenance - 1000),
            weightGain: Math.round(maintenance + 500),
        });
    };

    const handleSetGoal = (calorie) => {
        setCalGoal(calorie);
        localStorage.setItem("calorieGoal", JSON.stringify(calorie));
        setCalorieOptions(null);
    };

    const handleRecalculate = () => {
        setCalGoal(null);
        localStorage.removeItem("calorieGoal");
        setCalorieOptions(null);
        setUserData({ age: "", weight: "", goalWeight: "", height: "", gender: "male", activity: "sedentary" });
    };

    const isFormValid = userData.age && userData.weight && userData.goalWeight && userData.height;

    // ── CURRENT GOAL VIEW ──
    if (calGoal) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto px-4 py-12">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/25 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <Flame className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Your Daily Goal</h1>
                        <p className="text-zinc-400">This is your personalised calorie target</p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center mb-6">
                        <p className="text-zinc-400 text-sm mb-2">Daily Calorie Target</p>
                        <p className="text-6xl font-black text-emerald-400 mb-1">{calGoal}</p>
                        <p className="text-zinc-400 font-medium">kcal / day</p>

                        <div className="mt-6 pt-6 border-t border-zinc-800 grid grid-cols-3 gap-4 text-center">
                            {[
                                { label: 'Protein', value: `~${Math.round(calGoal * 0.3 / 4)}g`, color: 'text-emerald-400' },
                                { label: 'Carbs', value: `~${Math.round(calGoal * 0.45 / 4)}g`, color: 'text-amber-400' },
                                { label: 'Fat', value: `~${Math.round(calGoal * 0.25 / 9)}g`, color: 'text-blue-400' },
                            ].map(({ label, value, color }) => (
                                <div key={label}>
                                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                                    <p className="text-zinc-500 text-xs mt-0.5">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleRecalculate}
                            className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl transition-all text-sm border border-zinc-700"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Recalculate
                        </button>
                        <a
                            href="/track"
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3 rounded-xl transition-all text-sm"
                        >
                            Log Food
                            <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </Layout>
        );
    }

    // ── CALORIE OPTIONS VIEW ──
    if (calorieOptions) {
        return (
            <Layout>
                <div className="max-w-xl mx-auto px-4 py-12">
                    <div className="mb-8">
                        <button onClick={() => setCalorieOptions(null)} className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-4 flex items-center gap-1">
                            ← Back
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-1">Choose your goal</h2>
                        <p className="text-zinc-400 text-sm">Pick a calorie target that matches your intention</p>
                    </div>

                    <div className="space-y-3">
                        {GOAL_OPTIONS.map(({ key, label, desc, icon: Icon, color, border }) => (
                            <button
                                key={key}
                                onClick={() => handleSetGoal(calorieOptions[key])}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border ${border} transition-all group`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center`}>
                                        <Icon className={`w-4 h-4 ${color}`} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white font-semibold text-sm">{label}</p>
                                        <p className="text-zinc-500 text-xs">{desc}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold text-lg ${color}`}>{calorieOptions[key]}</p>
                                    <p className="text-zinc-600 text-xs">kcal/day</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }

    // ── INPUT FORM VIEW ──
    return (
        <Layout>
            <div className="max-w-xl mx-auto px-4 py-12">
                <div className="mb-10 text-center">
                    <div className="w-14 h-14 bg-violet-500/15 border border-violet-500/25 rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <Calculator className="w-7 h-7 text-violet-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Calorie Calculator</h1>
                    <p className="text-zinc-400 text-sm">Based on the Mifflin-St Jeor formula</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                    {/* Row: Age + Gender */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="nutrify-label">Age (years)</label>
                            <input type="number" name="age" value={userData.age} onChange={handleInputChange} placeholder="25" min="12" className="nutrify-input" />
                        </div>
                        <div>
                            <label className="nutrify-label">Gender</label>
                            <select name="gender" value={userData.gender} onChange={handleInputChange} className="nutrify-select">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    {/* Row: Weight + Height */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="nutrify-label">Weight (kg)</label>
                            <input type="number" name="weight" value={userData.weight} onChange={handleInputChange} placeholder="70" min="1" className="nutrify-input" />
                        </div>
                        <div>
                            <label className="nutrify-label">Height (cm)</label>
                            <input type="number" name="height" value={userData.height} onChange={handleInputChange} placeholder="175" min="1" className="nutrify-input" />
                        </div>
                    </div>

                    {/* Goal Weight */}
                    <div>
                        <label className="nutrify-label">Goal Weight (kg)</label>
                        <input type="number" name="goalWeight" value={userData.goalWeight} onChange={handleInputChange} placeholder="65" min="1" className="nutrify-input" />
                    </div>

                    {/* Activity Level */}
                    <div>
                        <label className="nutrify-label">Activity Level</label>
                        <div className="space-y-2 mt-1">
                            {ACTIVITY_OPTIONS.map(({ value, label, description }) => (
                                <label key={value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${userData.activity === value ? 'border-emerald-500/40 bg-emerald-500/8' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-800/30'}`}>
                                    <input
                                        type="radio"
                                        name="activity"
                                        value={value}
                                        checked={userData.activity === value}
                                        onChange={handleInputChange}
                                        className="accent-emerald-500"
                                    />
                                    <div>
                                        <p className={`text-sm font-medium ${userData.activity === value ? 'text-emerald-400' : 'text-zinc-300'}`}>{label}</p>
                                        <p className="text-xs text-zinc-500">{description}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={calculateCalories}
                        disabled={!isFormValid}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold py-3.5 rounded-xl transition-all text-sm"
                    >
                        <Target className="w-4 h-4" />
                        Calculate My Daily Calories
                    </button>
                </div>
            </div>
        </Layout>
    );
}
