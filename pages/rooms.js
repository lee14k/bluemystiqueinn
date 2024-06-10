import React, { useState, useEffect } from "react";
import RoomCard from "@/components/RoomCard";
import Footer from "@/components/FrontEnd/Footer";
import Navbar from "@/components/FrontEnd/Navbar";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/get-rooms");
      const roomsData = await response.json();
      if (response.ok) {
        setRooms(roomsData);
      } else {
        console.error("Error fetching rooms:", roomsData.error);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleDetails = (room) => {
    console.log("Room details:", room);
  };

  return (
    <div>
      <Navbar />
      <h1>Our Rooms</h1>
      <p>
        All of our rooms are located on a second floor, please call or contact
        us if you have further questions.
      </p>
      <p>Click each card to learn more about our rooms.</p>
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          roomName={room.second_name}
          occupancy={room.occupancy}
          rate={room.rate}
          image={room.image}
          onSelect={() => handleRoomSelect(room)}
          selected={selectedRoom?.id === room.id}
          onDetails={() => handleDetails(room)}
          availability="Available" // Always show as available
        />
      ))}
      <Footer />
    </div>
  );
}
