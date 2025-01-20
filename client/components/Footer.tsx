"use client";
import React, { useState } from "react";

export default function Footer() {
    return (
        <footer className="flex bg-willow-brook-300 flex-row flex-wrap items-center justify-center w-full py-6 px-5 text-center border-t gap-y-6 gap-x-12 border-slate-200 md:justify-between">
            <p className="block text-slate-800 font-semibold text-sm">
              AdventureAtlas
            </p>
            <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
                <li>
                    <a href="#" className="text-slate-700 hover:text-slate-500 focus:text-slate-500 text-sm">
                      Privacy  
                    </a>
                </li>
                <li>
                    <a href="#" className="text-slate-700 hover:text-slate-500 focus:text-slate-500 text-sm">
                      Terms  
                    </a>
                </li>
            </ul>
        </footer>
    );
};