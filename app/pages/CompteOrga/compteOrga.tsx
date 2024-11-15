import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import CloseIcons from "@/app/icons/x";
import TopnavOrga from '../../component/topnavOrga/topnavOrga';
import './compteOrga.css';
import HeartIcon from '@/app/icons/hear';
import ShopIcon from '@/app/icons/shop';
import { AxiosError } from 'axios';

type Event = {
  id: number;
  title: string;
  date: string;  // or Date if you're working with Date objects
  time: string;  // or Date if you're working with Date objects
  type: string;
  location: string | null;
  promotion: string | null;
  image: string | null;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('./api/events');
        if (Array.isArray(data)) {
          setEvents(data); // TypeScript now knows this is an Event[]
        } else {
          console.error('Unexpected data format:', data);
          setError('Unexpected data format.');
        }
      }  catch (error) {
        if (error instanceof AxiosError) {
          // Now TypeScript knows error is an AxiosError
          console.error('Failed to create event:', error.response ? error.response.data : error.message);
        } else {
          // For other types of errors
          console.error('Failed to create event:', error);
        }
        setError('Failed to create event.');
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

    const [hour, minute] = timeParts.map((part) => Number(part));

    if (isNaN(hour) || isNaN(minute)) {
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
      if (error instanceof AxiosError) {
        // Now TypeScript knows `error` is an `AxiosError`
        console.error('Failed to create event:', error.response ? error.response.data : error.message);
      } else {
        // Handle other types of errors (e.g., a non-Axios error)
        console.error('Failed to create event:', error);
      }
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

          {Array.isArray(events) ? (
            [...events].reverse().map((event, index) => {
              const eventDate = new Date(event.date);
              const eventTime = new Date(`${event.date}T${event.time}`);
              const formattedTime = isNaN(eventTime.getTime()) ? 'Invalid Time' : eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={index} className="event">
                  <div className="infoOrga">
                    <img className="profileImage" src="./user.jpg" alt="Profile" />
                    <p className="UserOrganisateur">KexEvent</p>
                  </div>
                  <h3 className="titreEvenement">{event.title}</h3>
                  <p className="DateEvenement">Date: {eventDate.toLocaleDateString()}</p>
                  <p className="HeureEvenement">Heure: {formattedTime}</p>
                  <p className="TypeEvenement">Type: {event.type}</p>
                  <p className="LieuEvenement">Lieu: {event.location || 'Non spécifié'}</p>
                  <p className="PromotionEvenement">
                    {event.promotion ? (
                      event.promotion.split('\n').map((line, idx) => (
                        <span key={idx}>
                          {line}
                          <br />
                        </span>
                      ))
                    ) : (
                      <span>Pas de promotion disponible</span> // You can show a fallback message if promotion is null
                    )}
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
            })
          ) : (
            <p>No events found.</p>
          )}


      </div>
    </div>
  );
}
