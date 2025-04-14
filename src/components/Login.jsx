import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginForm() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch(`${backendUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Login successful!");
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));// Store user data if needed
                navigate("/dashboard");
            } else {
                toast.error(data.message || "Login failed");
            }
        } catch (err) {
            toast.error("Something went wrong!");
            console.log(err);
        }

    };

    const handleRegister = () => {
        console.log("Redirect to Register Page");
        // Implement navigation to register page
        navigate("/register");
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Login</h2>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="btn" onClick={handleLogin}>Login</button>
                <p className="register-text">
                    New user? <button className="link" onClick={handleRegister}>Register</button>
                </p>
            </div>
        </div>
    );
}