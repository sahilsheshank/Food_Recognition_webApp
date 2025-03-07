import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';

function TodayCal() {
    const [caloriesConsumed, setCaloriesConsumed] = useState(0);
    const [food, setFood] = useState([]);
    const loggedData = useContext(UserContext);

    // Fetch the food consumed today
    useEffect(() => {
        const todayCal = () => {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0'); // Ensure 2 digits
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const year = today.getFullYear();

            fetch(`http://localhost:8000/api/Tracking/getfood/${loggedData.loggedUser.userid}/${day}-${month}-${year}`, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((data) => {
                    setFood(data);
                    calculateTotalCalories(data);
                })
                .catch((err) => {
                    console.error('Error fetching history:', err);
                    alert('Failed to fetch history.');
                });
        };
        todayCal();
    }, [loggedData.loggedUser.userid]);

    // Function to calculate total calories consumed
    const calculateTotalCalories = (data) => {
        let totalCalories = 0;
        data.forEach(item => {
            totalCalories += item.foodId.calories * (item.quantity / 100);  // assuming quantity is in grams and calories are per 100g
        });
        setCaloriesConsumed(totalCalories);
    };

    // Calculate remaining calorie
    const goalCalories = localStorage.getItem("calorieGoal");
    const remainingCalories = goalCalories - caloriesConsumed;

    return (
        <div>
            <h2>Today's Calories</h2>
            <p>Total Calories Consumed: {Math.round(caloriesConsumed)} kcal</p>
            <p>Goal Calories: {Math.round(goalCalories)} kcal</p>
            <p>Remaining Calories: {Math.round(remainingCalories)} kcal</p>

            <h3>Food Eaten Today:</h3>
            <ul>
                {food.map((item) => (
                    <li key={item._id}>
                        <p>{item.foodId.name} ({item.quantity}g)</p>
                        <p>Calories: {item.foodId.calories * (item.quantity / 100)} kcal</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodayCal;
