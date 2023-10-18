import Link from "next/link";
import React from "react";

export default function Navbar({ logout }) {
  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <Link legacyBehavior href="/">
            <a
              className="text-blueGray-700 text-sm uppercase md:inline-block font-semibold"
              href="#"
            >
              PERSEA
            </a>
          </Link>
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <button
              className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
              type="button"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
