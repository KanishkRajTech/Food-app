import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Model';

export default function InputForm({ setIsOpen }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        let endpoint = isSignUp ? "usersignup" : "userlogin";
        let payload = isSignUp
            ? { username: name, email, password }
            : { email, password };

        try {
            const response = await axios.post(`http://localhost:5000/food/v1/${endpoint}`, payload);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            setIsOpen(false);
        } catch (error) {
            setError(error.response?.data?.error || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Modal onClose={() => setIsOpen(false)}>
            <div className="auth-container">
                <div className="auth-header">
                    <h1 className="auth-app-title">Food Recipes</h1>
                    <h2 className="auth-title">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
                    <p className="auth-subtitle">
                        {isSignUp ? "Sign up to start exploring recipes" : "Log in to your account"}
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleOnSubmit}>
                    {isSignUp && (
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                id="name"
                                type="text"
                                className="form-input"
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Enter your name"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`auth-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                {isSignUp ? "Creating Account..." : "Logging in..."}
                            </>
                        ) : (
                            isSignUp ? "Sign Up" : "Login"
                        )}
                    </button>

                    <div className="auth-switch">
                        <p>
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}
                            <button
                                type="button"
                                className="switch-button"
                                onClick={() => {
                                    setIsSignUp(prev => !prev);
                                    setError("");
                                }}
                            >
                                {isSignUp ? "Login" : "Sign Up"}
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </Modal>
    );
}