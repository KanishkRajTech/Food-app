import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState({
        title: "",
        ingredients: [],
        instructions: "",
        time: "",
        coverImage: ""
    });

    // ✅ Fetch recipe by ID
    const getData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/food/v1/getrecipe/${id}`);
            const data = res.data.data;

            setRecipe({
                ...data,
                ingredients: Array.isArray(data.ingredients) ? data.ingredients : []
            });
        } catch (error) {
            console.error("Error fetching recipe:", error);
        }
    };

    useEffect(() => {
        getData();
    }, [id]);

    // ✅ Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "ingredients") {
            setRecipe({ ...recipe, ingredients: value.split(",") });
        } else {
            setRecipe({ ...recipe, [name]: value });
        }
    };

    // ✅ Handle form submit (update recipe)
   const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("title", recipe.title);
    formData.append("time", recipe.time);
    formData.append("instructions", recipe.instructions);
    formData.append("ingredients", recipe.ingredients);
    if (recipe.coverImage instanceof File) {
      formData.append("coverImage", recipe.coverImage);
    }

    await axios.put(
      `http://localhost:5000/food/v1/updaterecipe/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    navigate("/");
  } catch (error) {
    console.error("Error updating recipe:", error);
  }
};

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 sm:p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Edit Your Recipe</h2>
                        <p className="text-gray-600">Update your delicious recipe with the form below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center justify-between">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Recipe Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={recipe.title || ""}
                                    onChange={handleChange}
                                    placeholder="e.g., Classic Chocolate Chip Cookies"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                            {/* Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cooking Time
                                </label>
                                <input
                                    type="text"
                                    name="time"
                                    value={recipe.time || ""}
                                    onChange={handleChange}
                                    placeholder="e.g., 45 minutes"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>


                        {/* Ingredients */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ingredients <span className="text-gray-500 text-sm">(separate with commas)</span>
                            </label>
                            <textarea
                                name="ingredients"
                                value={
                                    Array.isArray(recipe.ingredients) ? recipe.ingredients.join(", ") : ""
                                }
                                onChange={handleChange}
                                placeholder="e.g., 2 cups flour, 1 cup sugar, 3 eggs"
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Instructions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Instructions
                            </label>
                            <textarea
                                name="instructions"
                                value={recipe.instructions || ""}
                                onChange={handleChange}
                                placeholder="Step-by-step instructions for your recipe..."
                                rows="6"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>



                        {/* Cover Image URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cover Image URL
                            </label>
                            <input
                                type="file"
                                name="coverImage"
                                onChange={(e) =>
                                    setRecipe({ ...recipe, coverImage: e.target.files[0] }) // store file object
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Preview Image */}
                        {recipe.coverImage && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                                <div className="flex justify-center">
                                    <img
                                        src={`http://localhost:5000/images/${recipe.coverImage}`}
                                        alt="Recipe Cover"
                                        className="w-64 h-64 object-cover rounded-lg shadow-md border"
                                        onError={(e) => (e.target.src = "/fallback.png")}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                            >
                                Update Recipe
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}