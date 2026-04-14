"use client";

import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    // Ensure this only runs in the browser
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("nutrify-app");
      if (userData) {
        try {
          setLoggedUser(JSON.parse(userData));
        } catch (err) {
          console.error("Error parsing user data from localStorage", err);
          setLoggedUser(null);
        }
      }
    }
  }, []);

  const [calGoal, setCalGoal] = useState({
    calories: null,
    carbs: 289,
    fat: 77,
    protein: 116,
  });

  return (
    <UserContext.Provider
      value={{
        calGoal,
        setCalGoal,
        loggedUser,
        setLoggedUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
