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
  const month = String(date.getMonth() + 1).padStart(2, '0');
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
    const events = await prisma.event.findMany();
    const formattedEvents = events.map(event => ({
      ...event,
      date: formatDate(event.date),
      time: formatTime(event.time),
    }));

    console.log('GET Response:', formattedEvents);
    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
}

async function handlePost(req, res) {
  const form = formidable({
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(400).json({ error: 'Error parsing form' });
    }

    const { title, date, time, type, location, promotion } = fields;
    const image = files.image ? files.image.newFilename : null;

    // Convert date and time fields to Date objects
    try {
      const dateValue = new Date(date);
      const [hours, minutes] = time.split(':');
      const timeValue = new Date(dateValue);
      timeValue.setHours(hours, minutes);

      const event = await prisma.event.create({
        data: {
          title,
          date: dateValue,
          time: timeValue,
          type,
          location: location || null,
          promotion: promotion || null,
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
