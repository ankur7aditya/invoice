import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

function DashBoard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigator = useNavigate();
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        navigator("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="flex items-center justify-between p-4 bg-gray-900 text-white lg:w-1/4 lg:flex-col lg:justify-start lg:items-start">
        <div className="text-xl flex space-x-5 font-bold ">
          <img
            src={localStorage.getItem("logo")}
            alt="comapany-logo"
            className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full shadow-lg"
          />
          <div>
            <p className="sm:text-xl lg:text-5xl">
              {localStorage.getItem("user")}
            </p>
          </div>
        </div>
        <button className="lg:hidden block text-2xl" onClick={toggleMenu}>
          {menuOpen ? "✕" : "☰"}
        </button>
        <div
          className={`absolute top-16 right-0 text-white  shadow-md rounded-lg p-4 ${
            menuOpen ? "block bg-black" : "hidden "
          } lg:static lg:flex lg:flex-col lg:w-full`}
        >
          <Link
            className="no-underline hover:bg-blue-700  py-2 px-4 block text-left"
            to=""
          >
            Home
          </Link>
          <Link
            className="no-underline hover:bg-blue-700  py-2 px-4 block text-left"
            to="invoices"
          >
            Invoices
          </Link>
          <Link
            className="no-underline hover:bg-blue-700  py-2 px-4 block text-left"
            to="newinvoices"
          >
            New Invoices
          </Link>
          <Link
            className="no-underline hover:bg-blue-700  py-2 px-4 block text-left"
            to="setting"
          >
            Settings
          </Link>
          <button
            onClick={handleLogOut}
            className="bg-gray-500 hover:bg-blue-700  my-5 rounded-lg p-2"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 bg-gray-300">
        <Outlet />
      </div>
    </div>
  );
}

export default DashBoard;
