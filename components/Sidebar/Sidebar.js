import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar({ logout }) {
  const [collapseShow, setCollapseShow] = useState("hidden");
  const router = useRouter();

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <button
              className="active:bg-blueGray-600 text-sm font-bold uppercase outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
              type="button"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex">
                <h6 className="text-blueGray-500 text-xl uppercase font-bold block pt-1 pb-4 no-underline">
                  Persea
                </h6>
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="items-center">
              <Link legacyBehavior href="/admin/dashboard">
                <a
                  href="#"
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (router.pathname.indexOf("/admin/dashboard") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                >
                  <i
                    className={
                      "fas fa-tv mr-2 text-sm " +
                      (router.pathname.indexOf("/admin/dashboard") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  Dashboard
                </a>
              </Link>
            </div>

            <div className="items-center">
              <Link legacyBehavior href="/admin/clients">
                <a
                  href="#"
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (router.pathname.indexOf("/admin/clients") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                >
                  <i
                    className={
                      "fas fa-users mr-2 text-sm " +
                      (router.pathname.indexOf("/admin/clients") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  Clientes
                </a>
              </Link>
            </div>

            {/* <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Link legacyBehavior href="/admin/settings">
                  <a
                    href="#"
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/admin/settings") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-700 hover:text-blueGray-500")
                    }
                  >
                    <i
                      className={
                        "fas fa-tools mr-2 text-sm " +
                        (router.pathname.indexOf("/admin/settings") !== -1
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                    ></i>{" "}
                    Settings
                  </a>
                </Link>
              </li>

              <li className="items-center">
                <Link legacyBehavior href="/admin/tables">
                  <a
                    href="#"
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/admin/tables") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-700 hover:text-blueGray-500")
                    }
                  >
                    <i
                      className={
                        "fas fa-table mr-2 text-sm " +
                        (router.pathname.indexOf("/admin/tables") !== -1
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                    ></i>{" "}
                    Tables
                  </a>
                </Link>
              </li>

              <li className="items-center">
                <Link legacyBehavior href="/admin/maps">
                  <a
                    href="#"
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/admin/maps") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-700 hover:text-blueGray-500")
                    }
                  >
                    <i
                      className={
                        "fas fa-map-marked mr-2 text-sm " +
                        (router.pathname.indexOf("/admin/maps") !== -1
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                    ></i>{" "}
                    Maps
                  </a>
                </Link>
              </li>
            </ul> */}

            <div className="flex-grow" />
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
        </div>
      </nav>
    </>
  );
}
