import React, { useState } from "react";
import foodrecipe from "../assets/foodrecipe.avif";
import Recipeitems from "../compoents/Recipeitems";
import { useNavigate } from "react-router-dom";
import Modal from "../compoents/Model";
import InputForm from "../compoents/InputForm";

export default function Home() {
    const navigate = useNavigate();
    const [isOpen, setOpen] = useState(false);

    // Define the closeLogin function here
    const closeLogin = () => {
        setOpen(false);
    };

    const addrecipes = () => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/addrecipes");
        } else {
            setOpen(true);
        }
    };

    return (
        <>
            <section className="hero-pattern py-12 md:py-20 mt-18">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 mb-10 md:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                            Discover <span className="text-red-600">Delicious Recipes</span> From Around The World
                        </h1>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            Whether you're a seasoned chef or just starting out, our collection of recipes has something for everyone. Explore new cuisines, try different cooking techniques, and find inspiration for your next meal.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={addrecipes}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium transition duration-300 transform hover:-translate-y-1 floating-btn"
                            >
                                Share your recipe
                            </button>
                            <button className="border border-red-500 text-red-600 hover:bg-emerald-50 px-6 py-3 rounded-full font-medium transition duration-300">
                                Explore Recipes
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-red-100 rounded-2xl transform rotate-3"></div>
                            <img
                                src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=726&q=80"
                                alt="Delicious food recipe"
                                className="relative rounded-2xl shadow-lg w-full max-w-md object-cover transform -rotate-2"
                            />
                        </div>
                    </div>
                </div>
            </section>
            {isOpen && (
                <Modal onClose={closeLogin}>
                    <InputForm setIsOpen={setOpen} />
                </Modal>
            )}
            <div className="container mx-auto px-10 py-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Delicious Recipes</h1>
                <p className="text-gray-600 text-center mb-8">Discover and save your favorite recipes</p>
                <Recipeitems />
            </div>
        </>
    );
}