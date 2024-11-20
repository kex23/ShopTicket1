import { createObjectCsvWriter } from 'csv-writer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import fs from 'fs';

// Chemin vers le fichier CSV
const csvFilePath = './tickets.csv';

// Vérifier si le fichier CSV existe
const checkFileExists = (path) => {
  return fs.existsSync(path);
};

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

// Gestionnaire pour l'API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { name, email, ticketType } = req.body;

  if (!name || !email || !ticketType) {
    return res.status(400).json({ error: 'Missing required fields: name, email, or ticketType' });
  }

  try {
    // Vérification si le fichier CSV existe
    if (!checkFileExists(csvFilePath)) {
      // Si le fichier n'existe pas, créez-le avec l'en-tête
      await csvWriter.writeRecords([]);
    }

    // Générer un identifiant unique
    const ticketId = uuidv4();

    // Générer le QR code
    const qrCodeData = `Ticket ID: ${ticketId}\nName: ${name}\nEmail: ${email}\nType: ${ticketType}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    // Écrire les données dans le fichier CSV
    await csvWriter.writeRecords([
      {
        id: ticketId,
        name: name,
        email: email,
        ticketType: ticketType,
        qrCode: qrCodeImage,
      },
    ]);

    return res.status(201).json({
      message: 'Ticket generated successfully',
      ticketId,
      qrCode: qrCodeImage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to generate the ticket' });
  }
}
