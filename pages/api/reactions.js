import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const filePath = path.join(process.cwd(), 'public', 'reactions.csv');

  if (req.method === 'POST') {
    try {
      const { eventId, count } = req.body;
      if (!eventId || count === undefined) {
        return res.status(400).json({ error: 'Missing eventId or count' });
      }

      // Lire le fichier CSV et mettre à jour le count
      const data = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
      let found = false;
      let updatedData = data.map((line) => {
        const [storedEventId, storedCount] = line.split(',');
        if (storedEventId === eventId) {
          found = true;
          return `${storedEventId},${count}`; // Mettre à jour le count
        }
        return line;
      });

      if (!found) {
        updatedData.push(`${eventId},${count}`); // Ajouter une nouvelle ligne si non trouvé
      }

      // Réécrire le fichier CSV avec les données mises à jour
      fs.writeFileSync(filePath, updatedData.join('\n'));

      return res.status(200).json({ message: 'Reaction saved successfully' });
    } catch (error) {
      console.error('Error saving reaction:', error);
      return res.status(500).json({ error: 'Failed to save reaction' });
    }
  } else if (req.method === 'GET') {
    try {
      // Lire le fichier CSV et convertir les données en un format utilisable
      const data = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);

      // Convertir chaque ligne en un objet { eventId, count }
      const reactions = data.map((line) => {
        const [eventId, count] = line.split(',');
        return { eventId, count: parseInt(count, 10) };
      });

      // Retourner les données sous forme de JSON
      return res.status(200).json(reactions);
    } catch (error) {
      console.error('Error reading CSV file:', error);
      return res.status(500).json({ error: 'Failed to read CSV file' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
