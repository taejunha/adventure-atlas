"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [open, setOpen] = useState<boolean>(false); // State to manage mobile menu

  return (
    <>
      {/* Navbar */}
      <div className="w-full h-20 bg-willow-brook-300 shadow-md sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link href="/" className="text-white text-xl font-semibold">
              AdventureAtlas
            </Link>

            {/* Links for larger devices */}
            <ul className="hidden md:flex gap-x-6 text-black">
              <li className="hover:text-white">
                <Link href="/about">About</Link>
              </li>
              <li className="hover:text-white">
                <Link href="/contact">Contact</Link>
              </li>
              <li className="hover:text-white">
                <Link href="/login">Sign In</Link>
              </li>
              <li className="hover:text-white">
                <Link href="/map">Map</Link>
              </li>
            </ul>

            {/* Hamburger Icon for mobile */}
            <button
              className="md:hidden text-black text-3xl focus:outline-none"
              onClick={() => setOpen(!open)}
            >
              <FontAwesomeIcon icon={open ? faTimes : faBars} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed top-20 left-0 w-full bg-willow-brook-300 z-50 shadow-md md:hidden">
          <ul className="flex flex-col items-center gap-y-4 py-4 text-black">
            <li className="hover:text-white">
              <Link href="/about" onClick={() => setOpen(false)}>
                About
              </Link>
            </li>
            <li className="hover:text-white">
              <Link href="/contacts" onClick={() => setOpen(false)}>
                Contact
              </Link>
            </li>
            <li className="hover:text-white">
              <Link href="/signin" onClick={() => setOpen(false)}>
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};
