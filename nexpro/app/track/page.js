'use client'
import { UserContext } from "../../contexts/UserContext";
import { useContext, useState } from "react";
import Nutrition from "../nutrition/page";
import TodayCal from "../../components/todayCal/TodayCal";

export default function Track() {
    const loggedData = useContext(UserContext);
    const [foodItems, setFoodItems] = useState([]);
    const [food, setFood] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    function searchFood(event) {
        const query = event.target.value.trim();
        setSearchQuery(query);

        if (query.length !== 0) {
            fetch(`http://localhost:8001/api/Food/fooditem/${query}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${loggedData.loggedUser.token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {

                    if (data.message === undefined) {
                        setFoodItems(data);
                    } else {
                        setFoodItems([]); // No items found
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setFoodItems([]);
        }
    }

    return (

        <section className="w-full max-w-4xl mx-auto p-4 space-y-6">
            {/* Search Section */}
            <div className="relative flex flex-row">
                <input
                    type="search"
                    value={searchQuery}
                    onChange={searchFood}
                    placeholder="Search Food Item"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {searchQuery && Array.isArray(foodItems) && foodItems.length > 0 && (
                    <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-y-auto border">
                        {foodItems.map((item) => (
                            <p
                                key={item._id}
                                className="p-3 cursor-pointer hover:bg-blue-100 transition"
                                onClick={() => {
                                    setFood(item);
                                    setSearchQuery("");
                                    setFoodItems([]);
                                }}
                            >
                                {item.name}
                            </p>
                        ))}
                    </div>
                )
                }
            </div>

            {/* Food Details */}
            {food && (
                <div className="border rounded-lg p-4 bg-gray-50 shadow">
                    <Nutrition food={food} />
                </div>
            )}
            <TodayCal />
        </section>

    );
}
