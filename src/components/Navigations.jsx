import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <div className="flex gap-10 ml-40">
      <h3>
        <Link to="/">Movies</Link>
      </h3>
      <h3>
        <Link to="/tv-shows">TV Shows</Link>
      </h3>
      <h3>
        <Link to="/anime">Anime</Link>
      </h3>
      <h3>
        <Link to="/cartoons">Cartoons</Link>
      </h3>
    </div>
  );
}

export default Navigation;
