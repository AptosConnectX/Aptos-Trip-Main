import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { WalletSelector } from "./WalletSelector";
import logo from "../assets/logo.png";

const Header = () => {
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  const toggleActivityMenu = () => {
    setIsActivityOpen(!isActivityOpen);
  };

  return (
    <header className="flex items-center justify-between border-b border-solid border-b-[#253646] px-10 py-3">
      <div className="flex items-center gap-4 text-white">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Road Trip NFT Logo" className="h-16" />
        </Link>
      </div>
      <nav className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <Link className="flex items-center gap-2 text-white text-sm font-medium hover:text-[#61dafb]" to="/">
            <FaHome className="text-lg" />
            Main
          </Link>
          <Link className="text-white text-sm font-medium hover:text-[#61dafb]" to="/trip-route">Trip Route</Link>
          <Link className="text-white text-sm font-medium hover:text-[#61dafb]" to="/nft-collection">NFT Collection</Link>
          <Link className="text-white text-sm font-medium hover:text-[#61dafb]" to="/mint-nft">Mint NFT</Link>
          
          {/* Вкладка Activity с выпадающим меню */}
          <div className="relative">
            <button
              onClick={toggleActivityMenu}
              className="text-white text-sm font-medium hover:text-[#61dafb] focus:outline-none"
            >
              Activity
            </button>
            {isActivityOpen && (
              <div className="absolute mt-2 w-48 bg-[#253646] rounded-md shadow-lg z-10">
                <Link
                  to="/car-list"
                  className="block px-4 py-2 text-white text-sm hover:bg-[#61dafb] hover:text-black"
                  onClick={() => setIsActivityOpen(false)}
                >
                  Car List
                </Link>
                <Link
                  to="/points"
                  className="block px-4 py-2 text-white text-sm hover:bg-[#61dafb] hover:text-black"
                  onClick={() => setIsActivityOpen(false)}
                >
                  Points
                </Link>
                <Link
                  to="/trip-2000"
                  className="block px-4 py-2 text-white text-sm hover:bg-[#61dafb] hover:text-black"
                  onClick={() => setIsActivityOpen(false)}
                >
                  T.R.I.P 2000
                </Link>
              </div>
            )}
          </div>

          <Link className="text-white text-sm font-medium hover:text-[#61dafb]" to="/road-map">Road Map</Link>
          <Link className="text-white text-sm font-medium hover:text-[#61dafb]" to="/partners">Partners</Link>
          <Link className="text-white text-sm font-medium hover:text-[#61dafb]" to="/shop">Shop</Link>
        </div>
        <WalletSelector />
      </nav>
    </header>
  );
};

export default Header;