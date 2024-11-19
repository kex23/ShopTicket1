import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Topnav from '../../component/topnav';
import "./homepage.css";

import ShopIcon from '@/app/icons/shop';
import HeartWithCounter from '@/app/component/reaction/reaction';
import Reaction from '@/app/component/reaction/reaction';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  location: string;
  promotion: string;
  image?: string;
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]); 
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('./api/events');
        if (Array.isArray(data)) {
          setEvents(data);  // Now TypeScript knows data is of type Event[]
        } else {
          console.error('Unexpected data format:', data);
          setError('Unexpected data format.');
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError('Failed to fetch events.');
      }
    };

    fetchEvents();
  }, []);

  // Function to format the date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date'; // Return an invalid date message if the date is not valid
    }
    return date.toLocaleDateString(); // or any other format you prefer
  };
  

  // Function to format the time in hh:mm
  const formatTime = (timeString: string): string => {
    const time = new Date(`1970-01-01T${timeString}Z`); // Make it a valid time object
    if (isNaN(time.getTime())) return 'Invalid Time'; // If the time is invalid, return 'Invalid Time'
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  

  return (
    <div className="contenuePage">
      <Topnav />

      <div className="conte">
        <div className="afficheEVEnement">
        {events
          .filter((event) => event.title && event.date && event.time && event.type && event.location) // Filter only complete events
          .map((event, index) => {
            // Convert the date format from dd/mm/yyyy to yyyy-mm-dd for proper JavaScript parsing
            const dateParts = event.date ? event.date.split('/') : [];
            const formattedTime = formatTime(event.time);
            const formattedDate = dateParts.length === 3 ? new Date(dateParts.reverse().join('-')).toLocaleDateString() : 'Invalid Date';

            return (
              <div key={index} className="event">
                <div className="infoOrga">
                  <img className="profileImage" src="./Rekologo.jpg" alt="Profile" />
                  <p className="UserOrganisateur">REKO tours 2024</p>
                </div>
                <h3 className="titreEvenement">{event.title}</h3>
                <p className="DateEvenement">Date: {formattedDate}</p>
                <p className='HeureEvenement'>Heure: {formattedTime}</p>
                <p className="TypeEvenement">Type: {event.type}</p>
                <p className="LieuEvenement">Lieu: {event.location || 'Non spécifié'}</p>
                <p className="PromotionEvenement">
                  {event.promotion ? event.promotion.split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  )) : <p>No promotion specified.</p>}
                </p>
                <div className="DivImage">
                  {event.image && <img className="imageEvenement" src={`http://localhost:3000/uploads/${event.image}`} alt={event.title} />}
                </div>
                <div className="reactions">
                    <HeartWithCounter/>
                    <a href="https://m.me/1425480547681126" target="_blank" rel="noopener noreferrer" className="shoppingIcon">
                      <ShopIcon />Acheter des billets?
                    </a>
                  </div>
                </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
