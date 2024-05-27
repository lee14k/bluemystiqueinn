import React from 'react';
import Checkbox from '@mui/material/Checkbox';

const RoomCard = ({ availability, roomName, occupancy, rate, onSelect, selected }) => {
  return (
    <div key={`${roomName}-${availability}`} className={`room-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <span>{availability}</span>
      <h1>{roomName}</h1>
      <p>Occupancy: {occupancy}</p>
      <p>Rate: {rate}</p>
      <Checkbox checked={selected} onChange={onSelect} />
      {selected && <p>Selected</p>}
    </div>
  );
};

export default RoomCard;