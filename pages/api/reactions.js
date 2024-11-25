import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            const { eventId, count } = req.body;

            if (!eventId || count === undefined) {
                return res.status(400).json({ error: 'Missing eventId or count' });
            }

            // Check if the reaction for the event already exists
            const reaction = await prisma.reaction.findUnique({
                where: { eventId },
            });

            

            if (reaction) {
                // Update existing reaction count
                const updatedReaction = await prisma.reaction.update({
                    where: { eventId },
                    data: { count },
                });
                return res.status(200).json({ message: 'Reaction updated successfully', reaction: updatedReaction });
            } else {
                // Create a new reaction
                const newReaction = await prisma.reaction.create({
                    data: { eventId, count },
                });
                return res.status(200).json({ message: 'Reaction created successfully', reaction: newReaction });
            }
        } catch (error) {
            console.error('Error saving reaction:', error);
            return res.status(500).json({ error: 'Failed to save reaction' });
        }
    } else if (req.method === 'GET') {
        try {
            const reactions = await prisma.reaction.findMany({
                include: { Event: true }, // Optional: Include related event details
            });

            return res.status(200).json(reactions);
        } catch (error) {
            console.error('Error fetching reactions:', error);
            return res.status(500).json({ error: 'Failed to fetch reactions' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
