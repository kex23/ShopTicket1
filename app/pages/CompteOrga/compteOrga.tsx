import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import CloseIcons from "@/app/icons/x";
import TopnavOrga from '../../component/topnavOrga/topnavOrga';
import './compteOrga.css';
import HeartIcon from '@/app/icons/hear';
import ShopIcon from '@/app/icons/shop';

type Event = {
  title: string;
  date: string;
  time: string;
  type: string;
  location: string;
  promotion?: string;
  image?: string;
  id?: string;
};


export default function CompteOrga() {
  const [showFormulaire, setShowFormulaire] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventPromotion, setEventPromotion] = useState('');
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('./api/events');
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error('Unexpected data format:', data);
          setError('Unexpected data format.');
        }
      } catch (error: unknown) { // Assert the error type here
        if (axios.isAxiosError(error)) { // Check if error is an AxiosError
          console.error('Failed to fetch events:', error.response ? error.response.data : error.message);
          setError('Failed to fetch events.');
        } else {
          console.error('An unexpected error occurred:', error);
          setError('An unexpected error occurred.');
        }
      }
    };

    fetchEvents();
  }, []);

  const handlePublicationClick = useCallback(() => {
    setShowFormulaire(true);
  }, []);

  const handleCloseClick = useCallback(() => {
    setShowFormulaire(false);
    setError('');
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEventImage(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!eventTitle || !eventDate || !eventTime || !eventType || !eventLocation) {
      setError('All fields except promotion are required.');
      return;
    }
  
    // Ensure the time is in a valid format
    const timeParts = eventTime.split(':');
    if (timeParts.length !== 2) {
      setError('Invalid time format.');
      return;
    }
  
    const [hour, minute] = timeParts;
    
    // Convert hour and minute to numbers
    const hourNum = Number(hour);
    const minuteNum = Number(minute);
  
    if (isNaN(hourNum) || isNaN(minuteNum)) {
      setError('Invalid time format.');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', eventTitle);
    formData.append('date', eventDate);
    formData.append('time', eventTime);  // Ensure eventTime is in correct format
    formData.append('type', eventType);
    formData.append('location', eventLocation);
    if (eventPromotion) {
      formData.append('promotion', eventPromotion);
    }
    if (eventImage) {
      formData.append('image', eventImage);
    }
  
    try {
      const response = await axios.post('./api/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      if (response.data) {
        setEvents([response.data, ...events]);
        setShowFormulaire(false);
        setEventTitle('');
        setEventDate('');
        setEventTime('');
        setEventType('');
        setEventLocation('');
        setEventPromotion('');
        setEventImage(null);
        setError('');
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Unexpected response format.');
      }
    } catch (error) {
      // Handle the error as an AxiosError
      const axiosError = error as AxiosError;
    
      console.error('Failed to create event:', axiosError.response ? axiosError.response.data : axiosError.message);
      setError('Failed to create event.');
    }
    
  };
  
  
  return (
    <div className='contenue'>
      <TopnavOrga />
      <div className='contenuCompteOrga'>
        <div className="creePublication">
          <p className="textPublication">Voulez-vous publier un nouveau événement?</p>
          <div className="buttonValide">
            <button type="button" className='BTNConnecter' onClick={handlePublicationClick}>Publier</button>
          </div>
        </div>

        {showFormulaire && (
          <form className='forme' onSubmit={handleSubmit}>
            <div className="CloseWindows" onClick={handleCloseClick}>
              <CloseIcons className="ICoClose" />
            </div>
            <h2 className="titrepublier">Publier un événement</h2>
            {error && <p className="error">{error}</p>}
            <div className="titreevent">
              <input
                placeholder="Titre de l'événement"
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="InputMail"
              />
            </div>
            <div className="dateEnvent">
              <input
                type="date"
                placeholder="Date de l'événement"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="InputdateEnvent"
              />
            </div>
            <div className="Time">
              <input
                type="time"
                placeholder="Heure de commencement"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="InputTime"
              />
            </div>
            <div className="EventType">
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="InputEventType"
              >
                <option value="">Sélectionner le type d'événement</option>
                <option value="évangélique">Évangélique</option>
                <option value="sportif">Sportif</option>
                <option value="concert">Concert</option>
                <option value="cabaret">Cabaret</option>
              </select>
            </div>
            <div className="EventLocation">
              <input
                placeholder="Lieu de l'événement"
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="InputLocation"
              />
            </div>
            <div className="EventPromotion">
            <textarea
                placeholder="Phrase pour inciter les gens à acheter (optionnel)"
                value={eventPromotion}
                onChange={(e) => setEventPromotion(e.target.value)}
                className="InputPromotion"
              />
              <div className="DisplayPromotion">
                {/* Transform the text to include line breaks */}
                {eventPromotion.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
            <div className="ImageUpload">
              <FontAwesomeIcon icon={faImage} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="InputImage"
              />
            </div>
            <div className="buttonValide">
              <button type="submit" className="BTNConnecter">Créer</button>
            </div>
          </form>
        )}

      {events
        .filter((event) => event.title && event.date && event.time && event.type && event.location) // Filter only complete events
        .map((event, index) => {
          // Convert the date format from dd/mm/yyyy to yyyy-mm-dd for proper JavaScript parsing
          const dateParts = event.date ? event.date.split('/') : [];
          const formattedDate = dateParts.length === 3 ? new Date(dateParts.reverse().join('-')).toLocaleDateString() : 'Invalid Date';
          const formattedTime = event.time ? new Date(`${event.date}T${event.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Invalid Time';

          return (
            <div key={index} className="event">
              <div className="infoOrga">
                <img className="profileImage" src="./user.jpg" alt="Profile" />
                <p className="UserOrganisateur">KexEvent</p>
              </div>
              <h3 className="titreEvenement">{event.title}</h3>
              <p className="DateEvenement">Date: {formattedDate}</p>
              <p className="HeureEvenement">Heure: {formattedTime}</p>
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
                {event.image && <img className="imageEvenement" src={`./uploads/${event.image}`} alt={event.title} />}
              </div>
              <div className="reactions">
                <HeartIcon className="heartIcon" />
                <ShopIcon className="shoppingIcon" />
              </div>
            </div>
          );
        })}



    </div>
  </div>
);
}

    
