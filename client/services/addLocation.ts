import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, description, cityDetails, coordinates, userId } = req.body;

      if (!name || !description || !cityDetails || !coordinates || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newLocation = await prisma.location.create({
        data: {
          name,
          description,
          cityDetails,
          coordinates,
          userId,
        },
      });

      res.status(201).json(newLocation);
    } catch (error) {
      console.error('Error adding location:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
