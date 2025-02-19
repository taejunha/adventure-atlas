import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

// initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const locationId = req.nextUrl.searchParams.get('locationId');
    const userId = req.nextUrl.searchParams.get('userId');

    if (!locationId) {
      return NextResponse.json({ error: 'locationId is required' }, { status: 400 });
    }

    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedPhotos: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const key = `${locationId}/${Date.now()}-${file.name}`;

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      };

      const command = new PutObjectCommand(uploadParams);
      await s3.send(command);

      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${locationId}/${file.name}`;
      
      // update the location entry in the database
      const photo = await prisma.photo.create({
        data: {
          url: fileUrl,
          key,
          locationId,
          userId,
        },
    });
      uploadedPhotos.push(fileUrl);
    }

    return NextResponse.json({ message: 'Files uploaded successfully', photos: uploadedPhotos });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'File upload failed', details: (error as Error).message }, { status: 500 });
  }
}
