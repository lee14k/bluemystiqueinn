import React, { useState, useEffect } from "react";
import RoomCard from "@/components/RoomCard";
import { Della_Respira } from "next/font/google";
import Footer from "@/components/FrontEnd/Footer";
import Navbar from "@/components/FrontEnd/Navbar";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
const della = Della_Respira({ subsets: ["latin"], weight: "400" });

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);

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
    setSelectedRoomDetails(room);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedRoomDetails(null);
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center text-center container mx-auto">
        <h1 className={`text-6xl ${della.className}`}>Our Rooms</h1>
        <p>
          All of our rooms are located on a second floor, please call or contact
          us if you have further questions.
        </p>
        <p>Click each card to learn more about our rooms.</p>
      </div>

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

      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="room-details-title"
        aria-describedby="room-details-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400, md: 500 }, // Responsive width
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: { xs: 2, md: 4 }, // Responsive padding
            maxHeight: { xs: "80vh", md: "90vh" }, // Max height for scrollable content
            overflowY: "auto", // Enable vertical scrolling
          }}
        >
          {selectedRoomDetails && (
            <>
              <Typography id="room-details-title" variant="h6" component="h2">
                {selectedRoomDetails.second_name}
              </Typography>
              <CardMedia
                component="img"
                height="140"
                image={selectedRoomDetails.image}
                alt={selectedRoomDetails.second_name}
              />
              <Typography id="room-details-description" sx={{ mt: 2 }}>
                Occupancy: {selectedRoomDetails.occupancy}
              </Typography>
              <Typography id="room-details-rate" sx={{ mt: 2 }}>
                Description: {selectedRoomDetails.room_description}
              </Typography>
              <Typography id="room-details-rate" sx={{ mt: 2 }}>
                Rate: ${selectedRoomDetails.rate}
              </Typography>
              <Typography id="room-details-rate" sx={{ mt: 2 }}>
                Amenities:
                <ul>
                  {selectedRoomDetails.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </Typography>
              <Button
                onClick={handleClose}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
      <Footer />
    </div>
  );
}
