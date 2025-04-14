import { useNavigate } from "react-router-dom";

export default function AboutUs() {
    const navigate = useNavigate();

    return (
        <div className="about-container">
            <h1>About FinTasker</h1>
            <p className="about-description">
                Welcome to <strong>FinTasker</strong>, your all-in-one personal finance manager.
                We help you track your expenses, analyze your financial habits, and manage your budget
                with ease.
            </p>

            <div className="features-section">
                <div className="feature-card">
                    <h3>💰 Expense Tracking</h3>
                    <p>Monitor your daily, weekly, and monthly expenses effortlessly.</p>
                </div>

                <div className="feature-card">
                    <h3>📊 Financial Insights</h3>
                    <p>Gain valuable insights into your spending patterns with analytics.</p>
                </div>

                <div className="feature-card">
                    <h3>🔐 Secure & Private</h3>
                    <p>Your financial data is safe with our secure encryption methods.</p>
                </div>
            </div>

            <button className="back-btn" onClick={() => navigate("/")}>Back to Home</button>
        </div>
    );
}
