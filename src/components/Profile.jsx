import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [user, setUser] = useState({ name: "", phone: "", email: "", gender: "", dob: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    useEffect(() => {
        // Fetch user data from backend
        const storedUser = JSON.parse(localStorage.getItem("user")) || {};
        setUser(storedUser);
        console.log(user.dob);
    }, []);

    const handleUpdate = () => {
        const updatedUser = { ...user, userId: user._id }; // Ensure user ID is included
        fetch(`${backendUrl}/api/auth/editProfile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify(updatedUser),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    localStorage.setItem("user", JSON.stringify(data.updatedUser)); // Update local storage
                    toast.success("Profile updated successful!");
                    // navigate("/dashboard");
                } else setError("Update failed");
            })
            .catch(() => setError("Update failed"));
    };

    return (
        <>
            <div className="logout-container">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <div className="profile-container">
                <h2>Edit Profile</h2>
                {error && <p className="error">{error}</p>}

                <label>Name</label>
                <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />

                <label>Phone</label>
                <input type="text" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} />

                <label>Email</label>
                <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />

                <label>New Password</label>
                <input type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />

                <label>Gender</label>
                <select value={user.gender} onChange={(e) => setUser({ ...user, gender: e.target.value })}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <label>Date of Birth</label>
                <input type="date" value={user.dob ? new Date(user.dob).toISOString().split("T")[0] : ""} onChange={(e) => setUser({ ...user, dob: e.target.value })} />

                <button onClick={handleUpdate}>Save</button>
            </div>
        </>
    );
}
