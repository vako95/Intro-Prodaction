import React, { useState } from "react";
import "./AuthForm.css"; // здесь будут стили (ниже тоже покажу)

const AuthForm = () => {
    const [activeForm, setActiveForm] = useState("login");

    const forms = [
        { key: "login", label: "Login" },
        { key: "register", label: "Register" },
        { key: "forgot", label: "Forgot Password" },
    ];


    const allFormKeys = forms.map(f => f.key);
    const otherForms = allFormKeys.filter(f => f !== activeForm);
    const sortedForms = [activeForm, ...otherForms];

    return (
        <div className="auth-container">

            <div className="auth-sidebar">
                {sortedForms.map(key => {
                    const form = forms.find(f => f.key === key);
                    return (
                        <button
                            key={key}
                            className={key === activeForm ? "active" : ""}
                            onClick={() => setActiveForm(key)}
                        >
                            {form.label}
                        </button>
                    );
                })}
            </div>

  
            <div className="auth-content">
                {activeForm === "login" && <h2>Login Form</h2>}
                {activeForm === "register" && <h2>Register Form</h2>}
                {activeForm === "forgot" && <h2>Forgot Password Form</h2>}
            </div>
        </div>
    );
};

export default AuthForm;
