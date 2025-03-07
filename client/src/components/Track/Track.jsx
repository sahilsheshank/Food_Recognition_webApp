import { UserContext } from "../../contexts/UserContext";
import { useContext, useState } from "react";
import Nutrition from "../../pages/nutrition/nutrition";
import Layout from "../Layout/Layout";

export default function Track() {
    const loggedData = useContext(UserContext);
    const [foodItems, setFoodItems] = useState([]);
    const [food, setFood] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    function searchFood(event) {
        const query = event.target.value.trim();
        setSearchQuery(query);

        if (query.length !== 0) {
            fetch(`http://localhost:8000/api/Food/fooditem/${query}`, {
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
        <Layout>
            <section className="w-full max-w-4xl mx-auto p-4 space-y-6">
                {/* Search Section */}
                <div className="relative">
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={searchFood}
                        placeholder="Search Food Item"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    {searchQuery && foodItems.length > 0 && (
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
                    )}
                    {searchQuery && foodItems.length === 0 && (
                        <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg border p-3">
                            <p>No food items found</p>
                        </div>
                    )}
                </div>

                {/* Food Details */}
                {food && (
                    <div className="border rounded-lg p-4 bg-gray-50 shadow">
                        <Nutrition food={food} />
                    </div>
                )}
            </section>
        </Layout>
    );
}
