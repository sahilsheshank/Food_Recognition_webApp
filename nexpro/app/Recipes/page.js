"use client"
import React, { useEffect } from 'react'
import Layout from '../../components/Layout/page'
import { useState } from 'react'
import Search from './components/search'
import { getRecipes } from './api'
import RecipeList from './components/RecipeList'
const Recipes = () => {
  const [query, setQuery] = useState('pizza');

  const [resultValue, setResultvalue] = useState([]);

  useEffect(() => {
    getSearchedQuery();
  }, [query]);

  const getSearchedQuery = async () => {
    let result = await getRecipes(query);
    if (result && result.recipes) {
      setResultvalue(result.recipes);
    }


  }


  return (
    <>

      <Search setQuery={setQuery} />
      <RecipeList recipes={resultValue} query={query} />

    </>

  )
}

export default Recipes
