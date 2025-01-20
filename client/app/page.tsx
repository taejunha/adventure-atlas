'use client'

import Link from "next/link"
import Image from 'next/image'

export default function Hero() {
    return(
        <>
        <div className="h-screen text-white bg-willow-brook-300">
            <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
                <Image 
                    src="/travel.png"
                    width={500}
                    height={500}
                    className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center"
                    alt="Hero"
                    />
                <div className="text-center lg:w-5/12 w-full">
                    <h1 className="my-4 text-5xl font-bold leading-tight">
                        Memories That Last Forever
                    </h1>
                    <p className="text-2xl mb-8">
                        Save the memories that matter - build a collection of your most unfortgettable trips.
                    </p>
                    <div className="flex justify-center mx-auto">
                    <Link
                        href="/login"
                        className="hover:underline bg-white outline outline-1 border-gray-500 text-gray-800 font-bold rounded-full  py-4 px-8">
                        Start Documenting
                    </Link>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}