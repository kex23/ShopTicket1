import { createObjectCsvWriter } from 'csv-writer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Chemin vers le fichier CSV
const csvFilePath = path.join(process.cwd(), 'tickets.csv');

// Initialisation du writer CSV
const csvWriter = createObjectCsvWriter({
  path: csvFilePath,
  header: [
    { id: 'id', title: 'ID' },
    { id: 'name', title: 'Name' },
    { id: 'email', title: 'Email' },
    { id: 'ticketType', title: 'Ticket Type' },
    { id: 'qrCode', title: 'QR Code' },
  ],
  append: true, // Ajout à la fin du fichier CSV
});

// Fonction pour lire le fichier CSV et retourner les tickets
const readTicketsFromCSV = async () => {
  try {
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    return records;
  } catch (error) {
    console.error('Error reading CSV file:', error);
    throw new Error('Failed to read CSV file');
  }
};

// Gestionnaire pour l'API
export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Logique pour générer un ticket
    const { name, email, ticketType } = req.body;

    // Log pour voir les données envoyées
    console.log('Received data:', req.body);

    // Si une erreur de validation, retour
    if (!name || !email || !ticketType) {
      return res.status(400).json({ error: 'Missing required fields: name, email, or ticketType' });
    }

    try {
      const ticketId = uuidv4();
      const qrCodeData = `Ticket ID: ${ticketId}\nName: ${name}\nEmail: ${email}\nType: ${ticketType}`;
      const qrCodeImage = await QRCode.toDataURL(qrCodeData);

      // Vérifier si l'écriture dans le fichier CSV a réussi
      console.log('Writing ticket to CSV:', { id: ticketId, name, email, ticketType, qrCode: qrCodeImage });

      await csvWriter.writeRecords([
        { id: ticketId, name, email, ticketType, qrCode: qrCodeImage },
      ]);

      return res.status(201).json({
        message: 'Ticket generated successfully',
        ticketId,
        qrCode: qrCodeImage,
      });
    } catch (error) {
      console.error('Error generating ticket:', error);
      return res.status(500).json({ error: 'Failed to generate the ticket' });
    }
  }

  if (req.method === 'GET') {
    try {
      const tickets = await readTicketsFromCSV(); // Lire les tickets depuis le CSV
      console.log('Retrieved tickets from CSV:', tickets); // Log des tickets récupérés
  
      // Optionnel : validation ou formatage des tickets si nécessaire
      if (!Array.isArray(tickets) || tickets.length === 0) {
        return res.status(404).json({ error: 'No tickets found' });
      }
  
      return res.status(200).json(tickets); // Retourne tous les tickets
    } catch (error) {
      console.error('Error reading tickets from CSV:', error);
      return res.status(500).json({ error: 'Failed to read tickets from CSV' });
    }
  }
  

  // Méthode non autorisée pour les autres types de requêtes
  return res.status(405).json({ error: 'Method Not Allowed' });
}
