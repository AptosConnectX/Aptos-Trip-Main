import React from "react";
import "./tripRoute.css";
import tripRouteImage from "../assets/TRIPROUTE.png"; // Путь к новой картинке

const TripRoute = () => {
  return (
    <div className="trip-route-page">
      <div className="image-container">
        <img
          src={tripRouteImage}
          alt="Trip Route"
          className="route-image"
        />
      </div>
    </div>
  );
};

export default TripRoute;
