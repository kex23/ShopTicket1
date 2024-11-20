import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const filePath = path.join(process.cwd(), 'public', 'reactions.csv');

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    if (req.method === 'POST') {
        console.log('Request Body:', req.body);

        try {
            const { eventId, count } = req.body;
            if (!eventId || count === undefined) {
                return res.status(400).json({ error: 'Missing eventId or count' });
            }

            console.log('File Path:', filePath);

            const data = fs.existsSync(filePath)
                ? fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean)
                : [];

            let found = false;
            let updatedData = data.map((line) => {
                const [storedEventId, storedCount] = line.split(',');
                if (storedEventId === eventId) {
                    found = true;
                    return `${storedEventId},${count}`;
                }
                return line;
            });

            if (!found) {
                updatedData.push(`${eventId},${count}`);
            }

            fs.writeFileSync(filePath, updatedData.join('\n'));

            return res.status(200).json({ message: 'Reaction saved successfully' });
        } catch (error) {
            console.error('Error saving reaction:', error);
            return res.status(500).json({ error: 'Failed to save reaction' });
        }
    } else if (req.method === 'GET') {
        try {
            const data = fs.existsSync(filePath)
                ? fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean)
                : [];

            const reactions = data.map((line) => {
                const [eventId, count] = line.split(',');
                return { eventId, count: parseInt(count, 10) };
            });

            return res.status(200).json(reactions);
        } catch (error) {
            console.error('Error reading CSV file:', error);
            return res.status(500).json({ error: 'Failed to read CSV file' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
