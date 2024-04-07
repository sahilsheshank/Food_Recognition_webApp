import React, { useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import { useState } from 'react';
function Nutrition() {
    const[nutrition,setNutrition]=useState([]);
    const[query,setQuery]=useState('');
    useEffect(()=>{
      const fetchData = async () => {
        try {
          
          const response = await axios.get(
            `https://api.api-ninjas.com/v1/nutrition?query=${query}`,
            {
              headers: {
                'X-Api-Key': '81o7d7t6RERyfpbdmVczfnanjrqCVOFaCK4MWlZi',
                'Content-Type': 'application/json'
              }
            }
          );
          
          setNutrition(response.data);
        } catch (error) {
          console.error('Error: ', error);
        }
      };
  
      fetchData();
    },[nutrition])
    

    // const handleSearch=()=>{

    // }
    
    // if (loading) {
    //   return <div>Loading...</div>;
    // }
  
    // if (error) {
    //   return <div>Error: {error.message}</div>;
    // }
  
    return (
     <Layout>
       <div className="container mx-auto mt-5">
  <input 
    type="text" 
    onChange={(e)=>(setQuery(e.target.value))} 
    className="w-full p-3 border border-gray-300 rounded-md shadow-md focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out" 
    placeholder="Search Nutrition Data" 
  />
  <label className='m-4' htmlFor="">search through image</label>
  <input type="file" name="photo" accept="image/*" />
  <h1 className="text-2xl font-bold mt-5 mb-3">Nutrition Data:</h1>
  {nutrition ? (
    nutrition.map((nutrition, index) => (
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-white rounded-md shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        
      >
        <div>
          <h2 className="text-xl font-semibold mb-2">Nutrient</h2>
          <p className='border-2 bg-blue-300 text-white p-3 m-2 rounded-lg hover:bg-blue-400 transition-all ease-in-out'>Calories: {nutrition.calories}</p>
          <p className='border-2 bg-blue-300 text-white p-3 m-2 rounded-lg hover:bg-blue-400 transition-all ease-in-out'>Serving Size (g): {nutrition.serving_size_g}</p>
          <p className='border-2 bg-blue-300 text-white p-3 m-2 rounded-lg hover:bg-blue-400 transition-all ease-in-out'>Total Fat (g): {nutrition.fat_total_g}</p>
          <p className='border-2 bg-blue-300 text-white p-3 m-2 rounded-lg hover:bg-blue-400 transition-all ease-in-out'>Saturated Fat (g): {nutrition.fat_saturated_g}</p>
          <p className='border-2 bg-blue-300 text-white p-3 m-2 rounded-lg hover:bg-blue-400 transition-all ease-in-out'>Protein (g): {nutrition.protein_g}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Minerals</h2>
          <p className='border-2 bg-blue-300 text-white p-3 m-2 rounded-lg hover:bg-blue-400 transition-all ease-in-out'>Sodium (mg): {nutrition.sodium_mg}</p>
          <p className='border-2 bg-blue-300 text-white p-3 m-2 rounded-lg hover:bg-blue-400 transition-all ease-in-out'>Potassium (mg): {nutrition.potassium_mg}</p>
          <p className='border-2 bg-blue-300 text-white p-3 m-2 rounded-lg hover:bg-blue-400 transition-all ease-in-out'>Cholesterol (mg): {nutrition.cholesterol_mg}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Carbohydrates</h2>
          <p className='border-2 bg-blue-300 text-white p-3 m-2 rounded-lg hover:bg-blue-400 transition-all ease-in-out'>Total Carbohydrates (g): {nutrition.carbohydrates_total_g}</p>
          <p className='border-2 bg-blue-300 text-white p-3 m-2 rounded-lg hover:bg-blue-400 transition-all ease-in-out'>Fiber (g): {nutrition.fiber_g}</p>
          <p className='border-2 bg-blue-300 text-white p-3 m-2 rounded-lg hover:bg-blue-400 transition-all ease-in-out'>Sugar (g): {nutrition.sugar_g}</p>
        </div>
      </div>
    ))
  ) : (
    <div className="text-red-500 font-bold">NO RESULTS FOUND</div>
  )}
</div>
    
     </Layout>
)};

export default Nutrition
