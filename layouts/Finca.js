import React, { useEffect } from "react";
import { useRouter } from 'next/router'
import { onAuthStateChanged, signOut } from "/firebase/auth";

// components

import AdminNavbar from "/components/Navbars/AdminNavbar.js";
import Sidebar from "/components/Sidebar/Sidebar.js";
import HeaderStats from "/components/Headers/HeaderStats.js";
import FooterAdmin from "/components/Footers/FooterAdmin.js";

export default function Admin({ children }) {
  const router = useRouter()

  const logout = () => {
    signOut(() => {
      router.push('/')
    })
  }

  useEffect(() => {
    const unsubscribe = () => onAuthStateChanged((data) => {
      if(!data?.emailVerified) {
        router.push('/', 'forward', 'replace')
      }
    });

    return unsubscribe()
  }, [router])

  return (
    <>
      <Sidebar logout={logout} />
      <div className="relative md:ml-64 bg-blueGray-100 min-h-screen flex flex-col flex-grow">
        {/* <AdminNavbar logout={logout} /> */}
        {/* Header */}
        <div className="px-4 md:px-10 mx-auto w-full">
          {children}
        </div>
        {/* <HeaderStats /> */}
        <div className="px-4 md:px-10 mx-auto w-full pt-24 flex-grow flex flex-col justify-end">
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
