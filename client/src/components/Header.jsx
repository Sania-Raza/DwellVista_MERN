import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
   const navigate = useNavigate();
   const handleSubmit = (e) => {
     e.preventDefault();
     const urlParams = new URLSearchParams(window.location.search);
     urlParams.set("searchTerm", searchTerm);
     const searchQuery = urlParams.toString();
     navigate(`/search?${searchQuery}`);
   };


   useEffect(() => {
     const urlParams = new URLSearchParams(location.search);
     const searchTermFromUrl = urlParams.get("searchTerm");
     if (searchTermFromUrl) {
       setSearchTerm(searchTermFromUrl);
     }
   }, [location.search]);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Dwell</span>
            <span className="text-slate-700">Vista</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:border hover:border-blue-600 hover:text-blue-800 hover:px-2 hover:py-1 transition-all ">
              Home
            </li>
          </Link>

          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:border hover:border-blue-600 hover:text-blue-800 hover:px-2 hover:py-1 transition-all">
              About
            </li>
          </Link>

          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="img"
              />
            ) : (
              <li className="text-slate-800 hover:border hover:text-blue-700 hover:border-blue-600  hover:px-2 hover:py-1 transition-all">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
