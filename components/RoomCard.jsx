import React from 'react';

const RoomCard = ({ roomName, occupancy, rate, image, onSelect, selected, availability, onDetails }) => {
  return (
    <div className={`room-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="image-container">
        <img src={image} alt={roomName} />
      </div>
      <h2>{roomName}</h2>
      <p>Occupancy: {occupancy}</p>
      <p>Rate: ${rate}</p>
      <p className={availability === 'Unavailable' ? 'unavailable' : 'available'}>
        {availability}
      </p>
      <button onClick={onDetails}>Details</button>
      <style jsx>{`
        .room-card {
          border: 1px solid #ccc;
          padding: 16px;
          margin: 8px;
          cursor: pointer;
        }
        .room-card.selected {
          border: 6px solid #06b6d4;
        }
        .image-container {
          width: 40%;
          height: 15rem; /* Fixed height for all images */
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .room-card img {
          width: 100%;
          height: 100%;
          object-fit: cover; /* Ensures image covers the container without distortion */
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
