import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,  // Désactive le body parser par défaut pour gérer les fichiers
  },
};

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

// Function to clean input data (remove line breaks)
function cleanInput(input) {
  return input.replace(/[\r\n]+/g, ' ').trim();  // Remove all newline characters and extra spaces
}

// Function to read events from the CSV file
async function readEventsFromCSV() {
  const filePath = path.join(process.cwd(), 'public', 'events.csv');
  if (!fs.existsSync(filePath)) {
    return [];  // Return an empty array if the file does not exist
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  const rows = data.split('\n').slice(1);  // Skip the header row
  return rows.map(row => {
    const [id, title, date, time, type, location, promotion, image] = row.split(',');
    return { id, title, date, time, type, location, promotion, image };
  });
}

// Function to append an event to the CSV file
async function appendEventToCSV(event) {
  const filePath = path.join(process.cwd(), 'public', 'events.csv');
  const eventId = uuidv4();  // Generate a unique ID for the event

  // Clean the input to remove any newline characters
  const eventData = [
    eventId,
    cleanInput(event.title),
    formatDate(event.date),
    formatTime(event.time),
    cleanInput(event.type),
    cleanInput(event.location || ''),
    cleanInput(event.promotion || ''),
    event.image || ''
  ].join(',');

  fs.appendFileSync(filePath, `${eventData}\n`);
}

// Function to handle GET requests (fetching events)
async function handleGet(req, res) {
  try {
    const events = await readEventsFromCSV();
    console.log('GET Response:', events);
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
}

// Function to handle POST requests (creating a new event)
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

    const { title, date, time, type, location, promotion } = fields;
    const image = files.image ? files.image[0].newFilename : null;

    // Sanitize and normalize the field values
    const titleValue = Array.isArray(title) ? title[0] : title;
    const dateValue = Array.isArray(date) ? new Date(date[0]) : new Date(date);
    const timeValue = Array.isArray(time) ? time[0] : time;

    // Handle the time correctly
    const [hour, minute] = timeValue.split(':');
    if (isNaN(hour) || isNaN(minute)) {
      return res.status(400).json({ error: 'Invalid time format.' });
    }

    const timeFormatted = new Date(dateValue);
    timeFormatted.setHours(hour);
    timeFormatted.setMinutes(minute);

    const typeValue = Array.isArray(type) ? type[0] : type;
    const locationValue = Array.isArray(location) ? location[0] : location;
    const promotionValue = Array.isArray(promotion) ? promotion[0] : promotion;

    const event = {
      title: titleValue,
      date: dateValue,
      time: timeFormatted,
      type: typeValue,
      location: locationValue || null,
      promotion: promotionValue || null,
      image,
    };

    try {
      // Append the new event to the CSV file
      await appendEventToCSV(event);

      console.log('POST Response:', event);
      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Error creating event' });
    }
  });
}

// Default export for the handler
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
