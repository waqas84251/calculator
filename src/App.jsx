// src/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";
import Calculator from "./Calculator.jsx";

function App() {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <div className="app-container">
            <Calculator />
        </div>
    );
}

export default App;
