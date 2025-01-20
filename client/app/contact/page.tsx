'use client'

import Link from "next/link";

export default function Contact() {
    return (
      <div className="overflow-y-hidden flex flex-col items-center justify-center h-screen bg-gray-100">
        <p>This is an open-source project, so if you would like to run this locally or take a deeper look at the code, <Link href="https://github.com/taejunha/adventure-atlas" className="hover:underline text-blue-800">here</Link></p>
      </div>
    );
  }
  