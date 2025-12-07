import React from "react";
import { FaSearch } from "react-icons/fa";

function Searchbar() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search"
        className="w-96 p-2 pr-10 border-2 border-transparent focus:border-blue-600 focus:outline-none rounded-md"
      />
      <button className="absolute right-2 top-2 p-1 text-blue-300 hover:text-blue-600">
        <FaSearch />
      </button>
    </div>
  );
}

export default Searchbar;
