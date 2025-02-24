import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, country, cityDetails, visitedOn, coordinates, userId } = body;
        console.log("Request Body:", body); 
        // validate required fields
        // if (!name || !description || !cityDetails || !visitedOn || !userId || !locationId) {
        //     return NextResponse.json(
        //     { error: "All fields (name, description, cityDetails, coordinates, userId, locationId) are required." },
        //     { status: 400 }
        //     );
        // }

        const newLocation = await prisma.location.create({
            data: {
                name,
                description,
                country,
                cityDetails,
                visitedOn: new Date(visitedOn),
                coordinates: coordinates.map(Number),
                userId,
            },
        });
        return NextResponse.json(newLocation); 
    } catch (error) {
        console.error("Error creating location", error);
        return NextResponse.json(
            { error: "An error occurred while creating the location"},
            { status: 500 }
        );
    }
}