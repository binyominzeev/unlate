import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { personality, answers } = req.body;

    // Find user by email to get their ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's personality type
    await prisma.user.update({
      where: { id: user.id },
      data: { personalityType: personality },
    });

    // Save test result
    await prisma.personalityTestResult.create({
      data: {
        userId: user.id,
        personality,
        answers: JSON.stringify(answers),
      },
    });

    res.status(200).json({ message: 'Test result saved successfully' });
  } catch (error) {
    console.error('Error saving test result:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}