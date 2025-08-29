import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddFoodRecipe() {
    const [recipeData, setRecipeData] = useState({});
    const navigate = useNavigate();

    const onHandleChange = (e) => {
        let val;
        // Check if the input is a file and handle it correctly
        if (e.target.name === "coverImage") {
            val = e.target.files[0];
        } else if (e.target.name === "ingredients") {
            // Split the string and trim whitespace from each ingredient
            val = e.target.value.split(",").map(item => item.trim());
        } else {
            val = e.target.value;
        }
        setRecipeData(pre => ({ ...pre, [e.target.name]: val }));
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();

        const hasFile = !!recipeData.coverImage;
        const formData = new FormData();

        formData.append("title", recipeData.title);
        formData.append("time", recipeData.time);
        formData.append("instructions", recipeData.instructions);

        // Correctly append each ingredient as a separate item
        if (recipeData.ingredients && Array.isArray(recipeData.ingredients)) {
            recipeData.ingredients.forEach(ing => {
                formData.append("ingredients", ing);
            });
        }

        // Append the cover image only if a file was selected
        if (hasFile) {
            formData.append("coverImage", recipeData.coverImage);
        }

        try {
            await axios.post("http://localhost:5000/food/v1/createrecipe", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                },

            });
            navigate("/");
        } catch (err) {
            console.error("Upload failed:", err);
            // Optionally, show a user-friendly error message
        }
    };

    return (
        <div className="form-container mt-18">
            <div className="form-card">
                <h2 className="form-title">Add New Recipe</h2>
                <form className="recipe-form" onSubmit={onHandleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Recipe Title</label>
                        <input
                            type="text"
                            className="form-input"
                            name="title"
                            onChange={onHandleChange}
                            placeholder="Enter recipe title"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Cooking Time</label>
                        <input
                            type="text"
                            className="form-input"
                            name="time"
                            onChange={onHandleChange}
                            placeholder="e.g., 30 minutes, 1 hour"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">
                            Ingredients
                            <span className="input-hint">(separate with commas)</span>
                        </label>
                        <textarea
                            className="form-textarea"
                            name="ingredients"
                            rows="4"
                            onChange={onHandleChange}
                            placeholder="Flour, Sugar, Eggs..."
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Instructions</label>
                        <textarea
                            className="form-textarea"
                            name="instructions"
                            rows="6"
                            onChange={onHandleChange}
                            placeholder="Step-by-step instructions..."
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Recipe Image</label>
                        <div className="file-input-container">
                            <input
                                type="file"
                                className="file-input"
                                name="coverImage" // Changed from "file" to "coverImage"
                                onChange={onHandleChange}
                                accept="image/*"
                            />
                            <span className="file-input-label">Choose an image</span>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/")}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Add Recipe
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
