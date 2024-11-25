// src/config.js
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://shop-ticket.vercel.app/api/'
  : 'http://localhost:3000/api';

export default API_URL;
