import React, { useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import { useState } from 'react'
import Search from './search'
import { getRecipes } from './api'
import RecipeList from './RecipeList'
const Recipes=()=> {
  const [query,setQuery]=useState('pizza');
 
  const [resultValue,setResultvalue]=useState([]);
 
  useEffect(()=>{
    getSearchedQuery();
  },[query]);

  const getSearchedQuery=async()=>{
    let result=  await getRecipes(query);
    if(result && result.recipes){
      setResultvalue(result.recipes);
    }
    
  
  }
  

  return (
    <>
    <Layout>
      <Search setQuery={setQuery}/>
      <RecipeList recipes={resultValue} query={query}/>
    </Layout>
    </>
    
  )
}

export default Recipes
