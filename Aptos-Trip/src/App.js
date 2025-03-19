import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TripRoute from "./pages/TripRoute";
import NFTCollection from "./pages/NFTCollection";
import MintNFT from "./pages/MintNFT";
import CarList from "./pages/CarList";
import RoadMap from "./pages/RoadMap";
import Partners from "./pages/Partners";
import Points from "./pages/Points"; // Новая страница
import Trip2000 from "./pages/Trip2000"; // Новая страница
import Shop from "./pages/Shop"; // Новая страница
import "./pages/MainPageImage.css";
import mainImage from "./assets/MAINPAGEIMAGE.png";
import TermsAndConditions from "./legal/TermsAndConditions";
import PrivacyPolicy from "./legal/PrivacyPolicy";
import { WalletProvider } from "./components/WalletProvider";
import { ReactQueryClientProvider } from "./components/ReactQueryClientProvider";

function App() {
  return (
    <ReactQueryClientProvider>
      <WalletProvider>
        <Router>
          <div className="relative flex size-full min-h-screen flex-col bg-[#121a21] dark group/design-root overflow-x-hidden">
            <Header />
            <div className="flex-grow">
              <Routes>
                <Route
                  path="/"
                  element={
                    <div className="main-page-container">
                      <div className="main-image-container">
                        <img src={mainImage} alt="Main Page" className="main-image" />
                        <div className="buttons-container">
                          <Link to="/nft-collection" className="learn-more-button">
                            Learn More
                          </Link>
                          <Link to="/mint-nft" className="buy-now-button">
                            Buy Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  }
                />
                <Route path="/trip-route" element={<TripRoute />} />
                <Route path="/nft-collection" element={<NFTCollection />} />
                <Route path="/mint-nft" element={<MintNFT />} />
                <Route path="/car-list" element={<CarList />} />
                <Route path="/points" element={<Points />} /> {/* Новый маршрут */}
                <Route path="/trip-2000" element={<Trip2000 />} /> {/* Новый маршрут */}
                <Route path="/shop" element={<Shop />} /> {/* Новый маршрут */}
                <Route path="/road-map" element={<RoadMap />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </WalletProvider>
    </ReactQueryClientProvider>
  );
}

export default App;