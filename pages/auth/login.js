import React, { useEffect } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword, onAuthStateChanged } from "/firebase/auth";
import { save } from "/firebase/db";
import { useRouter } from 'next/router'
import { useToast } from '/contexts/toast.jsx'

// layout for page

import Auth from "/layouts/Auth.js";

export default function Login() {
  const router = useRouter()
  const { toast } = useToast()
  const [userData, setUserData] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  }

  const login = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword({
      email: userData.email,
      password: userData.password,
      toast,
      callback: (user) => {
        // create client if not exists
        save({
          collection: 'clients',
          docName: user.uid,
          item: { email: user.email }
        });

        router.push('/admin/dashboard')
      },
      onError: () => {}
    });
  }

  useEffect(() => {
    const unsubscribe = () => onAuthStateChanged((data) => {
      if(data?.emailVerified) {
        router.push('/admin/dashboard')
      }
    });

    return unsubscribe()
  }, [router])

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="flex-auto p-4 lg:px-10 py-10">
                <form>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email"
                      name="email"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                      name="password"
                      onChange={handleChange}
                    />
                  </div>
                  {/* <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        Recordarme
                      </span>
                    </label>
                  </div> */}

                  <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="button"
                      onClick={login}
                    >
                      Iniciar sesión
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-blueGray-200"
                >
                  <small>¿Has olvidado tu contraseña?</small>
                </a>
              </div>
              <div className="w-1/2 text-right">
                <Link legacyBehavior href="/auth/register">
                  <a href="#" className="text-blueGray-200">
                    <small>Crear cuenta</small>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Login.layout = Auth;
