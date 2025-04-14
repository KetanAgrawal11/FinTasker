import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    return (
        <div className="home-container">
            <h1>Welcome to Personal Finance Manager</h1>
            <p>Track your income, expenses, and manage your finances efficiently.</p>
            <div className="button-group">
                {!token ? (
                    <>
                        <button className="btn" onClick={() => navigate("/register")}>
                            Get Started
                        </button>
                        <button className="btn" onClick={() => navigate("/login")}>
                            Login
                        </button>
                    </>
                ) : (<button className="btn" onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                </button>
                )}
            </div>
        </div>
    );
} 