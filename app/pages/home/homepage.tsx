import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Topnav from '../../component/topnav';
import "./homepage.css";

import ShopIcon from '@/app/icons/shop';
import HeartWithCounter from '@/app/component/reaction/reaction';

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
                <div  className="event">
                  <div className="infoOrga">
                    <img className="profileImage" src="./user.jpg" alt="Profile" />
                    <p className="UserOrganisateur">KexEvent</p>
                  </div>
                  <h3 className='titreEvenement'>REKO tour 2024</h3>
                  <p className='DateEvenement'>Date: 29 Novembre 2024</p>
                  <p className='HeureEvenement'>Heure: 20 : 00</p>
                  <p className='TypeEvenement'>Type: Cabaret</p>
                  <p className='LieuEvenement'>Lieu: MAJUNGA @Shams Hotel Majunga be</p>
                  <p className="PromotionEvenement">
                  '##RES: 25 000AR <br />
                  '##PAF: 15 000AR <br />
                  <br />
                  'contacte pour plus d information : 032 07 460 27',
                  </p>
                  <div className="DivImage">
                    <img className='imageEvenement' src="/reko.jpg"  />
                  </div>
                  <div className="reactions">
                    <HeartWithCounter />
                    <a href="https://www.facebook.com/messages/t/100005706048858" target="_blank" rel="noopener noreferrer" className="shoppingIcon">
                      <ShopIcon/> Acheter des billets?
                    </a>
                  </div>
                </div>
         

        </div>
      </div>
    </div>
  );
}
