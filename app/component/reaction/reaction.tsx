import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import API_URL from '@/config'; 
import "./reaction.css"// Assurez-vous d'importer la bonne URL de l'API

// Définir l'interface Reaction
interface Reaction {
  eventId: string;
  count: number;
}

const Reaction = () => {
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);

  // Charger les données à partir de l'API
  useEffect(() => {
    const fetchReactionData = async () => {
      try {
        const response = await fetch(`${API_URL}`);
        if (response.ok) {
          const data: Reaction[] = await response.json(); // Typage explicite de data

          // Filtrer pour l'eventId '12345' et calculer le total des réactions
          const reactions = data.filter((reaction: Reaction) => reaction.eventId === '12345'); // Typage explicite de reaction
          const totalCount = reactions.reduce((total, reaction) => total + reaction.count, 0);
          
          setCount(totalCount); // Mise à jour du compteur
        } else {
          console.error('Failed to fetch reaction data');
        }
      } catch (error) {
        console.error('Error fetching reaction data:', error);
      }
    };

    fetchReactionData();
  }, []); // Ce useEffect se déclenche une seule fois lors du premier rendu

  // Gérer le clic pour changer l'état du cœur et mettre à jour le compteur
  const handleClick = async () => {
    const newIsActive = !isActive;
    setIsActive(newIsActive);

    const newCount = newIsActive ? count + 1 : count - 1;
    setCount(newCount);

    const data = { eventId: '12345', count: newCount };

    try {
      const response = await fetch(`${API_URL}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save reaction');
      }

      const result = await response.json();
      console.log('Reaction saved:', result);
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
