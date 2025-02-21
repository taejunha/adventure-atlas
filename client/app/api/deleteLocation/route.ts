import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

// initialize S3 client
const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

export async function DELETE(req: NextRequest) {
  try {
    const locationId = req.nextUrl.searchParams.get('locationId');
    console.log(locationId); 

    // checks for locationId
    if (!locationId) {
      return NextResponse.json({ error: 'locationId is required' }, { status: 400 });
    }

    // fetch photos assocaited with locationId
    const photos = await prisma.photo.findMany({
      where: { locationId },
    });

    // delete them frmo S3
    for (const photo of photos) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: photo.key,
      });
      await s3.send(deleteCommand);
    }

    // delete photos from Prisma
    await prisma.photo.deleteMany({
      where: { locationId },
    });

    // delete location from Prisma
    await prisma.location.delete({
      where: { id: locationId },
    });

    return NextResponse.json({ message: 'Location and associated photos deleted successfully.' });
  } catch (error) {
    console.error('error deleting location', error);
  }
}