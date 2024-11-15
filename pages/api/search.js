// server.js or similar file
const express = require('express');
const app = express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/api/events', async (req, res) => {
    const { query } = req.query;
    try {
        const events = await prisma.event.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { type: { contains: query, mode: 'insensitive' } }
                ]
            }
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
});

app.listen(3000, () => console.log('Server is running on port 3000'));
