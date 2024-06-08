import React from 'react';

const RoomCard = ({ roomName, occupancy, rate, image, onSelect, selected, availability, onDetails }) => {
  return (
    <div className={`room-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="image-container" style={{ backgroundImage: `url(${image})` }}>
        <h2 className="room-name">{roomName}</h2>
      </div>
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
          text-align: center;
        }
        .room-card.selected {
          border: 6px solid #06b6d4;
        }
        .image-container {
          width: 100%;
          height: 15rem; /* Fixed height for all images */
          background-size: cover;
          background-position: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .room-name {
          color: white;
          background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
          padding: 5px 10px;
          border-radius: 5px;
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
