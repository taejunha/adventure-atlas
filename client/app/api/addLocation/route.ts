import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { name, description, cityDetails, visitedOn, coordinates, userId, locationId } = body;

    const existingLocation = await prisma.location.findUnique({
        where: {
            locationId,
        },
    });

    if (existingLocation) {
        return NextResponse.json(
            { error: "You already created a location here" },
            { status: 409 }
        );
    }

    const newLocation = await prisma.location.create({
        data: {
            name,
            description,
            cityDetails,
            visitedOn,
            coordinates,
            userId,
            locationId,
        },
    });
    return NextResponse.json(newLocation); 
}