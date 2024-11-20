import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import "./reaction.css";
import API_URL from "@/config";

interface Reaction {
  eventId: string;
  count: number;
}


const Reaction = () => {
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);

  // Charger les données à partir du serveur
  useEffect(() => {
    const fetchReactionData = async () => {
      try {
        const response = await fetch(`${API_URL}/reactions`);
        if (response.ok) {
          const data: Reaction[] = await response.json(); // Typage explicite de 'data' en tant que tableau de Reaction
          console.log('Fetched data:', data);

          // Filtrer les données pour l'eventId '12345' et additionner les valeurs de count
          const reactions = data.filter((reaction) => reaction.eventId === '12345');
          const totalCount = reactions.reduce((total, reaction) => total + reaction.count, 0);

          setCount(totalCount); // Mettre à jour le compteur total
        }
      } catch (error) {
        console.error('Error fetching reaction data:', error);
      }
    };

    fetchReactionData();
  }, []);  // Ce useEffect se déclenche une seule fois lors du premier rendu

  const handleClick = async () => {
    const newIsActive = !isActive;
    setIsActive(newIsActive);

    const newCount = newIsActive ? count + 1 : count - 1;
    setCount(newCount);

    const data = { eventId: '12345', count: newCount }; // Assurez-vous que l'eventId est correct

    console.log('Sending data to API:', data); // Vérifiez les données envoyées

    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Envoi des données sous forme de JSON
      });

      if (!response.ok) {
        throw new Error('Failed to save reaction');
      }

      const result = await response.json();
      console.log('Reaction saved:', result); // Vérification des données enregistrées

    } catch (error) {
      console.error('Error saving reaction:', error);
    }
  };

  return (
    <div className="reaction-container" onClick={handleClick}>
      <div className="icon-container">
        {isActive ? (
          <HeartIconSolid className="icon solid" />
        ) : (
          <HeartIconOutline className="icon outline" />
        )}
      </div>
      <span className="counter">{count}</span>
    </div>
  );
};

export default Reaction;
