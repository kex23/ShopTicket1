import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

// Helper function to format date as dd/mm/yyyy
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Helper function to format time as hh:mm
function formatTime(dateString) {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

async function handleGet(req, res) {
  try {
    // Fetch events from database
    const events = await prisma.event.findMany();

    // Keep the date and time format as it is from the database
    const formattedEvents = events.map(event => ({
      ...event,
      date: event.date,  // Keep the original date format
      time: formatTime(event.time),  // Keep the original time format
    }));

    console.log('GET Response:', formattedEvents);
    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
}


async function handlePost(req, res) {
  console.log('Handling POST request');
  const form = formidable({
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Error parsing form' });
    }

    console.log('Form fields:', fields);
    console.log('Files:', files);

    // Extraire les champs du formulaire
    const { title, date, time, type, location, promotion } = fields;
    const image = files.image ? files.image[0].newFilename : null;

    // Convertir les valeurs de date et heure
    const titleValue = Array.isArray(title) ? title[0] : title;
    const dateValue = Array.isArray(date) ? new Date(date[0]) : new Date(date);
    const timeValue = Array.isArray(time) ? time[0] : time;

    // Combine date and time into a full DateTime object
    const [hour, minute] = timeValue.split(':');  // Extraire les heures et minutes
    if (isNaN(hour) || isNaN(minute)) {
      return res.status(400).json({ error: 'Invalid time format.' });
    }

    const timeFormatted = new Date(dateValue);
    timeFormatted.setHours(hour);
    timeFormatted.setMinutes(minute);

    // Récupérer les autres valeurs
    const typeValue = Array.isArray(type) ? type[0] : type;
    const locationValue = Array.isArray(location) ? location[0] : location;
    const promotionValue = Array.isArray(promotion) ? promotion[0] : promotion;

    console.log('Parsed values:', {
      title: titleValue,
      date: dateValue,
      time: timeFormatted,
      type: typeValue,
      location: locationValue,
      promotion: promotionValue,
      image: image,
    });

    // Créer l'événement dans la base de données
    try {
      const event = await prisma.event.create({
        data: {
          title: titleValue,
          date: dateValue,  // Stocker la date comme un objet Date
          time: timeFormatted,  // Stocker l'heure comme DateTime
          type: typeValue,
          location: locationValue || null,
          promotion: promotionValue || null,
          image,
        },
      });

      console.log('POST Response:', event);
      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Error creating event' });
    }
  });
}






export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
