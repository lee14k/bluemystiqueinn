const RoomCard = ({ availability, roomName, occupancy, rate }) => {
    return (
      <div>
        <span>{availability}</span>
        <h1>{roomName}</h1>
        <p>Occupancy: {occupancy}</p>
        <p>Rate: {rate}</p>
      </div>
    );
  };
  
  export default RoomCard;
  