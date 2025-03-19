import React from "react";
import "./Footer.css";
import { FaTelegramPlane, FaYoutube, FaInstagram } from "react-icons/fa";
import TwitterIcon from "../assets/twitter.png"; // Импорт иконки X (Twitter)

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-left">
                <p>© 2024 Aptos Trip. All Rights Reserved.</p>
                <p>
                    <a href="/terms" className="footer-link">Terms and Conditions</a>
                    {" | "}
                    <a href="/privacy" className="footer-link">Privacy Policy</a>
                </p>
            </div>
            <div className="footer-right">
                {/* Twitter */}
                <a href="https://x.com/AptosTrip" target="_blank" rel="noopener noreferrer" className="x-twitter">
                    <img 
                      src={TwitterIcon} 
                      alt="Twitter" 
                      className="social-icon" 
                      style={{ width: '19px', height: '19px', objectFit: 'contain' }} // Inline стиль для размера
                    />
                </a>
                <a
                    href="https://youtube.com/yourchannel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link youtube"
                >
                    <FaYoutube />
                </a>
                <a
                    href="https://t.me/yourchannel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link telegram"
                >
                    <FaTelegramPlane />
                </a>
                <a
                    href="https://instagram.com/yourprofile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link instagram"
                >
                    <FaInstagram />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
