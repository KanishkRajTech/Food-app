import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

export default function RecipeItems() {
  const recipes = useLoaderData()
  const [allRecipes, setAllRecipes] = useState([])
  const navigate = useNavigate()

  let path = window.location.pathname === "/myRecipe"
  let favItems = JSON.parse(localStorage.getItem("fav")) ?? []
  const [isFavRecipe, setIsFavRecipe] = useState(false)

  useEffect(() => {
    setAllRecipes(Array.isArray(recipes) ? recipes : [])
  }, [recipes])

  const onDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/food/v1/deleterecipe/${id}`)
      setAllRecipes(prev => prev.filter(recipe => recipe._id !== id))

      let filterItem = favItems.filter(recipe => recipe._id !== id)
      localStorage.setItem("fav", JSON.stringify(filterItem))
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const favRecipe = (item) => {
    let filterItem = favItems.filter(recipe => recipe._id !== item._id)
    favItems = favItems.some(recipe => recipe._id === item._id)
      ? filterItem
      : [...favItems, item]

    localStorage.setItem("fav", JSON.stringify(favItems))
    setIsFavRecipe(prev => !prev)
  }

  return (
    <div className=" px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {allRecipes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-6">
              {path ? "You haven't created any recipes yet." : "Explore and add some recipes to your favorites!"}
            </p>
            {path && (
              <button 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                onClick={() => navigate('/addrecipes')}
              >
                Create Your First Recipe
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allRecipes.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer flex flex-col h-full"
                onClick={() => navigate(`/recipe/${item._id}`)}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={`http://localhost:5000/images/${item.coverImage}`}
                    alt={item.title || "Recipe"}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/40 to-transparent"></div>
                  
                  {!path ? (
                    <div className="absolute top-2 right-2">
                      <button 
                        className={`p-2 rounded-full transition-colors duration-200 backdrop-blur-sm bg-white/80 ${
                          favItems.some(res => res._id === item._id) 
                            ? "text-red-500 hover:bg-red-100" 
                            : "text-gray-600 hover:bg-white"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          favRecipe(item);
                        }}
                        aria-label={favItems.some(res => res._id === item._id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <FaHeart className="w-5 h-5" />
                      </button>
                    </div>
                  ) : null}
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <BsStopwatchFill className="text-red-500 mr-1 text-sm" />
                      <span className="text-sm font-medium text-gray-800">{item.time}</span> 
                    </div>
                    
                    {path && (
                      <div className="flex space-x-2">
                        <Link 
                          to={`/editRecipe/${item._id}`} 
                          className="p-2 rounded-full text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Edit recipe"
                        >
                          <FaEdit className="w-4 h-4" />
                        </Link>
                        <button 
                          className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item._id);
                          }}
                          aria-label="Delete recipe"
                        >
                          <MdDelete className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                  
                  <div className="mt-auto">
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">{item.instructions}</p>
                    <div className="text-xs text-gray-500 mt-2 border-t pt-2">
                      Click to view full recipe
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}