import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Configurer les en-têtes CORS pour permettre les requêtes cross-origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const filePath = path.join(process.cwd(), 'public', 'reactions.csv'); // Chemin du fichier CSV

  // Si la méthode HTTP est POST (ajouter ou mettre à jour une réaction)
  if (req.method === 'POST') {
    try {
      const { eventId, count } = req.body; // Récupérer les données envoyées dans la requête

      // Vérifier si les données requises sont présentes
      if (!eventId || count === undefined) {
        return res.status(400).json({ error: 'Missing eventId or count' });
      }

      // Lire le fichier CSV existant et traiter les données
      const data = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean); // Lire le fichier CSV et diviser par lignes
      let found = false;
      let updatedData = data.map((line) => {
        const [storedEventId, storedCount] = line.split(',');
        if (storedEventId === eventId) {
          found = true;
          return `${storedEventId},${count}`; // Si l'eventId existe, mettre à jour le count
        }
        return line; // Sinon, garder la ligne inchangée
      });

      // Si l'eventId n'existe pas, ajouter une nouvelle entrée
      if (!found) {
        updatedData.push(`${eventId},${count}`);
      }

      // Réécrire les données mises à jour dans le fichier CSV
      fs.writeFileSync(filePath, updatedData.join('\n'));

      return res.status(200).json({ message: 'Reaction saved successfully' }); // Réponse réussie
    } catch (error) {
      console.error('Error saving reaction:', error);
      return res.status(500).json({ error: 'Failed to save reaction' }); // Erreur lors de la sauvegarde
    }
  } 

  // Si la méthode HTTP est GET (récupérer les réactions)
  else if (req.method === 'GET') {
    try {
      // Lire et traiter les données du fichier CSV
      const data = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean); // Lire le fichier CSV

      // Convertir chaque ligne en un objet { eventId, count }
      const reactions = data.map((line) => {
        const [eventId, count] = line.split(',');
        return { eventId, count: parseInt(count, 10) }; // Convertir count en nombre entier
      });

      return res.status(200).json(reactions); // Répondre avec les données des réactions
    } catch (error) {
      console.error('Error reading CSV file:', error);
      return res.status(500).json({ error: 'Failed to read CSV file' }); // Erreur lors de la lecture du fichier CSV
    }
  } 

  // Si la méthode HTTP n'est ni GET ni POST
  else {
    return res.status(405).json({ error: 'Method Not Allowed' }); // Méthode non autorisée
  }
}
