import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    return (
        <footer className="footer">
            <div className="footer-links">
                <button onClick={() => navigate("/")}>Home</button>
                <button onClick={() => navigate("/about")}>About Us</button>
                {!token ? (
                    <>
                        <button onClick={() => navigate("/login")}>Login</button>
                        <button onClick={() => navigate("/register")}>Register</button>
                    </>
                ) : (
                    <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                )}
            </div>

            <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            </div>

            <p className="copyright">© {new Date().getFullYear()} FinTasker. All Rights Reserved.</p>
        </footer>
    );
}
