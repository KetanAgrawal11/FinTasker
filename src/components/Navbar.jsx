import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token"); // Check if user is authenticated

    return (
        <div className="navbar">
            <div className="logo" onClick={() => navigate("/home")}>FinTasker</div>
            <div className="nav-links">
                <button className="nav-button" onClick={() => navigate("/about")}>About Us</button>
                {!token ? (
                    <>
                        <button className="nav-button" onClick={() => navigate("/login")}>Login</button>
                        <button className="nav-button" onClick={() => navigate("/register")}>Register</button>
                    </>
                ) : (
                    <>
                        {location.pathname === "/dashboard" ? (
                            <button className="nav-button" onClick={() => navigate("/taskManager")}>Tasks</button>
                        ) : (
                            <button className="nav-button" onClick={() => navigate("/dashboard")}>Dashboard</button>
                        )}
                        <button className="profile-button" onClick={() => navigate("/profile")}>
                            <i className="fa-solid fa-user"></i>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

