import React from 'react';
import { Della_Respira } from "next/font/google";
const della = Della_Respira({ subsets: ["latin"], weight: "400" });
const RoomCard = ({ roomName, occupancy, rate, image, onSelect, selected, availability, onDetails }) => {
  const isAvailable = availability === 'Available';

  return (
    <div
      className={`room-card ${selected ? 'selected' : ''}`}
      onClick={isAvailable ? onSelect : null}
      style={{
        backgroundColor: isAvailable ? 'white' : 'lightgray',
        cursor: isAvailable ? 'pointer' : 'not-allowed',
        opacity: isAvailable ? 1 : 0.5,
      }}
    >
      <div className="image-container" style={{ backgroundImage: `url(${image})` }}>
        <h2 className={`room-name text-6xl text-center ${della.className}`}>{roomName}</h2>
      </div>
      <p className='text-2xl'>${rate} per night</p>
      <p className={availability === 'Unavailable' ? 'unavailable' : 'available'}>
        {availability}
      </p>
      <button className='' onClick={(e) => { e.stopPropagation(); onDetails(); }} disabled={!isAvailable}>
        Details
      </button>
      <style jsx>{`
        .room-card {
          border: 1px solid #ccc;
          padding: 16px;
          margin: 8px;
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
