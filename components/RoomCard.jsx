// RoomCard.js
import React from 'react';

const RoomCard = ({ roomName, occupancy, rate, image, onSelect, selected, availability }) => {
  return (
    <div className={`room-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <img src={image} alt={roomName} />
      <h2>{roomName}</h2>
      <p>Occupancy: {occupancy}</p>
      <p>Rate: ${rate}</p>
      <p className={availability === 'Unavailable' ? 'unavailable' : 'available'}>
        {availability}
      </p>
      <style jsx>{`
        .room-card {
          border: 1px solid #ccc;
          padding: 16px;
          margin: 8px;
          cursor: pointer;
        }
        .room-card.selected {
          border-color: blue;
        }
        .room-card img {
          width: 100%;
          height: 1rem;
        }
        .unavailable {
          color: red;
        }
        .available {
          color: green;
        }
      `}</style>
    </div>
  );
};

export default RoomCard;
