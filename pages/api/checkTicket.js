import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

// Chemin vers le fichier CSV
const csvFilePath = './tickets.csv';

// Fonction pour lire le contenu du CSV
const readTicketsFromCsv = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(csvFilePath, 'utf8', (err, data) => {
      if (err) return reject(err);
      const rows = data.split('\n').slice(1).map(row => {
        const [id, name, email, ticketType, qrCode, isChecked] = row.split(',');
        return { id, name, email, ticketType, qrCode, isChecked: isChecked === 'true' };
      });
      resolve(rows);
    });
  });
};

// Fonction pour écrire dans le CSV
const writeTicketsToCsv = async (tickets) => {
  const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: [
      { id: 'id', title: 'ID' },
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'ticketType', title: 'Ticket Type' },
      { id: 'qrCode', title: 'QR Code' },
      { id: 'isChecked', title: 'Is Checked' },
    ],
    append: false, // Écrase le fichier CSV entier pour mettre à jour l'état
  });

  await csvWriter.writeRecords(tickets);
};

// Vérification du QR code
export async function GET(req, res) {
  const { qrCode, status } = req.query; // Récupérer les paramètres de la query string

  if (!qrCode) {
    return res.status(400).json({ message: 'QR code is required' });
  }

  try {
    const tickets = await readTicketsFromCsv();
    const ticket = tickets.find(t => t.qrCode === qrCode);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Si un statut est spécifié dans la query string
    if (status) {
      const filteredTickets = tickets.filter(t => 
        t.isChecked === (status === 'checked' ? true : false)
      );
      return res.json(filteredTickets);
    }

    // Retourner l'état du ticket
    return res.json({ isChecked: ticket.isChecked });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching ticket' });
  }
}

// Marquer le ticket comme vérifié
export async function POST(req, res) {
  const { qrCode } = req.body;

  if (!qrCode) {
    return res.status(400).json({ message: 'QR code is required' });
  }

  try {
    const tickets = await readTicketsFromCsv();
    const ticketIndex = tickets.findIndex(t => t.qrCode === qrCode);

    if (ticketIndex === -1) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const ticket = tickets[ticketIndex];

    // Vérifier si le ticket a déjà été vérifié
    if (ticket.isChecked) {
      return res.status(400).json({ message: 'Ticket already checked' });
    }

    // Marquer le ticket comme vérifié
    tickets[ticketIndex] = { ...ticket, isChecked: true };

    // Écrire les tickets mis à jour dans le CSV
    await writeTicketsToCsv(tickets);

    return res.status(200).json({ message: 'Ticket marked as checked', ticket: tickets[ticketIndex] });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating ticket' });
  }
}
