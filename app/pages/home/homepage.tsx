import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Topnav from '../../component/topnav';
import "./homepage.css";

import ShopIcon from '@/app/icons/shop';
import HeartWithCounter from '@/app/component/reaction/reaction';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/events');
        console.log(data);
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error('Unexpected data format:', data);
          setError('Unexpected data format.');
        }
      } catch (error) {
        console.error('Failed to fetch events:', error.response ? error.response.data : error.message);
        setError('Failed to fetch events.');
      }
    };

    fetchEvents();
  }, []);

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date'; // Return an invalid date message if the date is not valid
    }
    return date.toLocaleDateString(); // Format the date in default locale format (can adjust for dd/mm/yyyy if needed)
  };

  // Function to format the time in hh:mm
  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}Z`); // Make it a valid time object
    if (isNaN(time.getTime())) return 'Invalid Time'; // If the time is invalid, return 'Invalid Time'
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="contenuePage">
      <Topnav />

      <div className="conte">
        <div className="afficheEVEnement">
          {Array.isArray(events) ? (
            [...events].reverse().map((event, index) => {
              // Use formatDate and formatTime to ensure proper formatting
              const formattedDate = formatDate(event.date);
              const formattedTime = formatTime(event.time);

              return (
                <div key={index} className="event">
                  <div className="infoOrga">
                    <img className="profileImage" src="./user.jpg" alt="Profile" />
                    <p className="UserOrganisateur">KexEvent</p>
                  </div>
                  <h3 className='titreEvenement'>{event.title}</h3>
                  <p className='DateEvenement'>Date: {formattedDate}</p>
                  <p className='HeureEvenement'>Heure: {formattedTime}</p>
                  <p className='TypeEvenement'>Type: {event.type}</p>
                  <p className='LieuEvenement'>Lieu: {event.location || 'Non spécifié'}</p>
                  <p className="PromotionEvenement">
                    {/* Respect the line breaks in the event's promotion text */}
                    {event.promotion.split('\n').map((line, idx) => (
                      <span key={idx}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                  <div className="DivImage">
                    {event.image && <img className='imageEvenement' src={`http://localhost:3000/uploads/${event.image}`} alt={event.title} />}
                  </div>
                  <div className="reactions">
                    <HeartWithCounter className="heartIcon" />
                    <a href="https://www.facebook.com/messages/t/100094028230383" target="_blank" rel="noopener noreferrer" className="shoppingIcon">
                      <ShopIcon />
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No events found.</p>
          )}

        </div>
      </div>
    </div>
  );
}
