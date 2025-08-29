import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/home'
import MainNavigation from './compoents/mainNavigations'
import axios from 'axios'
import AddFoodRecipe from './pages/AddFoodRecipe'
import EditRecipe from './pages/EditRecipe'
import RecipeDetails from './pages/RecipeDetails'

const getAllRecipes = async () => {
  try {
    const res = await axios.get('http://localhost:5000/food/v1/getRecipes')
    const recipes = res.data.data || res.data   // <-- check both
    return Array.isArray(recipes) ? recipes : []
  } catch (error) {
    console.error("Error fetching all recipes:", error)
    return []
  }
}

const getMyRecipes = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"))
    const allRecipes = await getAllRecipes()
    return allRecipes.filter(item => item.createdBy === user?._id)
  } catch (error) {
    console.error("Error fetching my recipes:", error)
    return []
  }
}

const getFavRecipes = () => {
  const favs = JSON.parse(localStorage.getItem("fav"))
  return Array.isArray(favs) ? favs : []
}

const getRecipe = async ({ params }) => {
  try {
    const recipeRes = await axios.get(`http://localhost:5000/food/v1/getrecipe/${params.id}`)
    let recipe = recipeRes.data.data || recipeRes.data

    const userRes = await axios.get(`http://localhost:5000/food/v1/userprofile/${recipe.createdBy}`)
    recipe = { ...recipe, username: userRes.data.username }

    return recipe
  } catch (error) {
    console.error("Error fetching recipe:", error)
    return {}
  }
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home />, loader: getMyRecipes },
      { path: "/favrecipes", element: <Home />, loader: getFavRecipes },
      { path: "/addrecipes", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe }
    ]
  }
])

export default function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}
