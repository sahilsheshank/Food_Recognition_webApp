'use client'
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';

function TodayCal() {
    const [caloriesConsumed, setCaloriesConsumed] = useState(0);
    const [food, setFood] = useState([]);
    const [remainingCalories, setRemainingCalories] = useState();
    const [goalCalories, setGoalCalories] = useState();
    const loggedData = useContext(UserContext);
    console.log(loggedData);
    useEffect(() => {
        const todayCal = () => {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0'); // Ensure 2 digits
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const year = today.getFullYear();

            fetch(`http://localhost:8001/api/Tracking/getfood/${loggedData.loggedUser.userid}/${day}-${month}-${year}`, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((data) => {
                    setFood(data);
                    calculateTotalCalories(data);
                })
                .catch((err) => {
                    console.error('Error fetching history:', err);

                });
        };
        todayCal();
    }, [food]);

    const calculateTotalCalories = (data) => {
        let totalCalories = 0;
        data.forEach(item => {
            totalCalories += item.foodId.calories * (item.quantity / 100);
        });
        setCaloriesConsumed(totalCalories);
    };

    useEffect(() => {
        const goalCalories = JSON.parse(localStorage.getItem("calorieGoal"));
        setGoalCalories(goalCalories);
        const remCalories = goalCalories - caloriesConsumed;
        setRemainingCalories(remCalories);
    }, [])


    return (
        <div className='bg-white rounded-xl p-10'>
            <h2 className='border-2 border-sky-950  px-6 py-4 rounded-xl'>Today's Calories</h2>
            <p>Remaining Calories : <span className='font-semibold'>{Math.round(goalCalories)} kcal - {Math.round(caloriesConsumed)} kcal =</span> <span className='text-blue-600 text-xl font-semibold'>{Math.round(remainingCalories)} kcal</span></p>

            <h3 className='border-2 border-sky-950  px-6 py-4 rounded-xl'>Food Eaten Today:</h3>
            <ul>
                {food.map((item) => (
                    <ul className='py-2 border-b-2 ' key={item._id}>
                        <li>{item.foodId.name} ({item.quantity}g)</li>
                        <li>Calories: {item.foodId.calories * (item.quantity / 100)} kcal</li>
                    </ul>
                ))}
            </ul>
        </div>
    );
}

export default TodayCal;
