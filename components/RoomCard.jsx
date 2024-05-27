import React from 'react';
import Checkbox from '@mui/material/Checkbox';

const RoomCard = ({ availability, roomName, occupancy, rate, image, onSelect, selected }) => {
  return (
    <div className="grid grid-cols-2">
    <div key={`${roomName}-${availability}`} className={`room-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
    
      <span>{availability}</span>
      <h1>{roomName}</h1>
      <p>Rate: {rate}</p>
      <Checkbox checked={selected} onChange={onSelect} />
      {selected && <p>Selected</p>}
    </div>
    <div className='h-1/2'>
      {image && <img src={image} alt={`${roomName} image`} className="room-image" />}
      </div>
    </div>
  );
};

export default RoomCard;
