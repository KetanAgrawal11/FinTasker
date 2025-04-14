import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RegistrationForm() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        // dob validation (age must be at least 10)
        const tenYearsAgo = new Date();
        tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

        if (!dob || new Date(dob) > tenYearsAgo) {
            newErrors.dob = "DOB must be at least 10 years ago.";
        }

        // Gender validation (must be selected)
        if (!gender) newErrors.gender = "Please select a gender.";

        // Phone validation (10-digit number)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) newErrors.phone = "Phone must be a 10-digit number.";

        // Email validation (basic pattern check)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) newErrors.email = "Invalid email format.";

        // Password validation (minimum length 6)
        if (password.length < 6) newErrors.password = "Password must be at least 6 characters long.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        try {
            console.log(backendUrl)
            const response = await fetch(`${backendUrl}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, dob, gender, phone, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Registered successful!");
                try {
                    const response = await fetch(`${backendUrl}/api/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();
                    if (response.ok) {
                        toast.success("Login successful!");
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        navigate("/dashboard");
                    } else {
                        toast.error(data.message || "Login failed");
                    }
                } catch (err) {
                    toast.error("Something went wrong!");
                    console.log(err);
                }
            } else {
                toast.error(data.message || "Registration failed");
            }
        } catch (err) {
            toast.error("Something went wrong!");
            console.log(err);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Register</h2>
                <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="dob">dob</label>
                    <input
                        id="dob"
                        type="date"
                        placeholder="Enter your DOB"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                    />
                    {errors.dob && <small className="error">{errors.dob}</small>}
                </div>
                <div className="input-group">
                    <label htmlFor="gender">Gender</label>
                    <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <small className="error">{errors.gender}</small>}
                </div>
                <div className="input-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && <small className="error">{errors.phone}</small>}
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <small className="error">{errors.email}</small>}
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
                    {errors.password && <small className="error">{errors.password}</small>}
                </div>
                <button className="btn" onClick={handleRegister}>Register</button>
            </div>
        </div>
    );
}
