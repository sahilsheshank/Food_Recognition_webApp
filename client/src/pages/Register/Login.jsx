import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
function Login() {

    const loggedInData = useContext(UserContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const handleInput = (e) => {
        const { name, value } = e.target;
        setForm((prev) => (
            { ...prev, [name]: value }
        ))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:8001/api/Auth/login", {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) =>
                res.json()

            )
            .then((data) => {
                console.log(data)
                if (data == "user not found") {
                    alert("user not found")
                }
                else {
                    navigate("/home");
                    alert("login successful");
                    localStorage.setItem("nutrify-app", JSON.stringify(data));
                    loggedInData.setLoggedUser(data);


                }
                setForm({
                    email: "",
                    password: "",
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }
    return (
        <div className='flex flex-col justify-center gap-6 items-center h-screen  '>

            <h1 className='text-white font-bold'>Login To Your Account</h1>
            <form onSubmit={handleSubmit} className=" border-2 border-gray-800 rounded-3xl w-1/3 px-7 py-10">
                <div className="mb-5">
                    <label for="email" className="block mb-2 text-sm text-white font-medium">Your email</label>
                    <input onChange={handleInput} name='email' type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
                </div>
                <div className="mb-5">
                    <label for="password" className="block mb-2 text-sm font-medium text-white">Your password</label>
                    <input onChange={handleInput} name='password' type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>

                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                <button onClick={() => navigate('/signup')} className="text-white ml-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Create Account
                </button>
            </form>

        </div>
    )
}

export default Login
