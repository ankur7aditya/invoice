import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

function DashBoard() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="flex items-center justify-between p-4 bg-gray-100 lg:w-1/4 lg:flex-col lg:justify-start lg:items-start">
        <div className="text-xl flex space-x-5 font-bold">
          <img
            src={localStorage.getItem("logo")}
            alt="comapany-logo"
            className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full shadow-lg"
          />
          <p className="text-5xl">{localStorage.getItem("user")}</p>
        </div>
        <button className="lg:hidden block text-2xl" onClick={toggleMenu}>
          {menuOpen ? "✕" : "☰"}
        </button>
        <div
          className={`absolute top-16 right-0  shadow-md rounded-lg p-4 ${
            menuOpen ? "block bg-black text-white" : "hidden"
          } lg:static lg:flex lg:flex-col lg:w-full`}
        >
          <Link className="no-underline py-2 px-4 block text-left" to="">
            Home
          </Link>
          <Link
            className="no-underline py-2 px-4 block text-left"
            to="invoices"
          >
            Invoices
          </Link>
          <Link
            className="no-underline py-2 px-4 block text-left"
            to="newinvoices"
          >
            New Invoices
          </Link>
          <Link className="no-underline py-2 px-4 block text-left" to="setting">
            Settings
          </Link>
        </div>
      </div>

      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default DashBoard;
