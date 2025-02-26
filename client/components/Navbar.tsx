"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import getCurrentUser from "@/services/getCurrentUser";
import { SafeUser } from "@/app/types/";
import Categories from "./Categories";
import useLocationModal from "@/app/hooks/useLocationModal";

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const [open, setOpen] = useState<boolean>(false); // State to manage mobile menu
  const locationModal = useLocationModal();

  const onLocation = useCallback(() => {
    locationModal.onOpen(); 
  }, [currentUser, locationModal])

  return (
    <>
      {/* Navbar */}
      <div className="w-full h-20 bg-willow-brook-300 shadow-md sticky top-0 z-50">
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
                {currentUser ? (
                  <Link href="/login">Sign Out</Link>
                ):(
                  <Link href="/login">Sign In</Link>
                )}
              </li>
              <li className="hover:text-white">
                <div onClick={onLocation}>Add Location</div>
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

      < Categories />

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
            {/* <li className="hover:text-white"> */}
              {/* <Link href="/signin" onClick={() => setOpen(false)}> */}
                {/* Sign In */}
              {/* </Link> */}
            {/* </li> */}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar; 