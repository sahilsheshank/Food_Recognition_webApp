import React from 'react';
import Layout from '../../components/Layout/Layout';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Layout>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1470&q=80"
          alt="Healthy food"
        />

        {/* Dark overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/70"></div>

        {/* Hero Content */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Eat Smart, Live Better
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8 drop-shadow-md">
            Upload your food photos and get instant calorie and nutrient estimates powered by AI. Stay on top of your health with ease.
          </p>

          {/* Get Started Button */}
          <Link
            to="/caloriecalculator"
            className="bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition duration-300 shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
