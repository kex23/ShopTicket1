import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { useState } from 'react';
import './Reaction.css'; // Import the CSS file

const Reaction = () => {
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setIsActive(!isActive);
    setCount(count + (isActive ? -1 : 1));
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
